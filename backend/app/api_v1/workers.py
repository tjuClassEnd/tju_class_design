#!/usr/bin/env python
# encoding=utf-8

from datetime import date, datetime

from flask import jsonify, request, g, abort, url_for, current_app

from . import api
from .util import add_to_db, delete_to_db, add_residue, sub_residue
from app import db
from .errors import bad_request
from ..models import Worker, WorkerDegree, Holiday, WorkAdd, HolidayType


@api.route('/worker/holidays')
def get_holidays_info():
    holidays = g.current_user.holidays
    info = []
    for holiday in holidays:
        info.append(holiday.to_json())
    return jsonify({"holidays": info})


# not add to document
@api.route('/worker/holidays/<int:id>')
def get_holiday_info(id):
    holiday = Holiday.query.filter(Holiday.id == id).first()
    if holiday is None:
        return bad_request('no exit the holiday')
    if holiday.worker_id != g.current_user.id:
        return bad_request('you can look other people holiday')

    return jsonify(holiday.to_json())


@api.route('/worker/holidays', methods=['POST'])
def create_holiday():
    json_holiday = request.json
    holiday_type = json_holiday.get('holiday_type')
    holiday_time_begin = json_holiday.get('holiday_time_begin')
    holiday_time_end = json_holiday.get('holiday_time_end')
    reason = json_holiday.get('holiday_reason')
    worker_id = g.current_user.id

    holiday = Holiday(type=holiday_type, worker_id=worker_id, holiday_time_begin=holiday_time_begin,
                      holiday_time_end=holiday_time_end, apply_time=date.today(), reason=reason)

    add_to_db(holiday)

    if holiday.holiday_time_begin > holiday.holiday_time_end:
        delete_to_db(holiday)
        return bad_request('begin is latter than end')

    if reason is None or reason == "":
        delete_to_db(holiday)
        return bad_request('you need reason to apply')

    if HolidayType.query.get(holiday_type) is None:
        delete_to_db(holiday)
        return bad_request('the holiday type not exit')

    if holiday.type == 2:
        long = (holiday.holiday_time_end - holiday.holiday_time_begin).days
        if holiday.worker.year_holidays_residue < long:
            delete_to_db(holiday)
            return bad_request("your annual leave nums isn't enough")
        else:
            sub_residue(holiday.worker, long)

    add_to_db(holiday)
    return jsonify({
        'holiday_id': holiday.id
    }), 201


@api.route('/worker/holidays/<int:id>', methods=['PUT'])
def modify_the_holiday(id):
    holiday = Holiday.query.filter(Holiday.id == id).first()

    if holiday is None:
        return bad_request("the holiday isn't exit")

    if holiday.worker_id != g.current_user.id:
        return bad_request("your can't modify the holiday which is not belong you")

    if holiday.apply_over:
        return bad_request("your can't modify the holiday is over")

    json_holiday = request.json
    holiday_end = json_holiday.get('holiday_end')

    if holiday_end:
        if holiday.apply_ok != 1:
            return bad_request('your can apply to end the holiday maybe in check or apply faily')

        holiday.apply_end = True

        add_to_db(holiday)
        return jsonify({"message": "your apply to end the holiday"})

    if holiday.apply_ok == 1:
        return bad_request("you can't modify the apply ok holiday")

    if holiday.apply_state not in [0, -1] and holiday.apply_ok != -1:
        return bad_request("you can't modify the holiday in check")

    holiday_time_begin = json_holiday.get("holiday_begin_time")
    holiday_time_end = json_holiday.get("holiday_end_time")
    type = json_holiday.get('holiday_type')

    old_holiday_begin = holiday.holiday_time_begin
    old_holiday_end = holiday.holiday_time_end

    holiday.holiday_time_begin = holiday_time_begin
    holiday.holiday_time_end = holiday_time_end

    add_to_db(holiday)

    if holiday.holiday_time_begin > holiday.holiday_time_end:
        holiday.holiday_time_begin = old_holiday_begin
        holiday.holiday_time_end = old_holiday_end
        add_to_db(holiday)
        return bad_request('begin is latter than end')

    long = (holiday.holiday_time_end - holiday.holiday_time_begin).days
    old_long = (old_holiday_end - old_holiday_begin).days

    if holiday.type == 2:
        if type == '2':
            if holiday.worker.year_holidays_residue + old_long < long:
                holiday.holiday_time_begin = old_holiday_begin
                holiday.holiday_time_end = old_holiday_end
                add_to_db(holiday)
                return bad_request("your annual leave nums isn't enough")
            else:
                add_residue(holiday.worker, old_long)
                sub_residue(holiday.worker, long)
        elif HolidayType.query.get(type):
            # from year to other
            add_residue(holiday.worker, old_long)
    # this mean your change the holiday not year to year
    elif type == '2':
        if holiday.worker.year_holidays_residue < long:
            holiday.holiday_time_begin = holiday_time_begin
            holiday.holiday_time_end = holiday_time_end
            add_to_db(holiday)
            return bad_request("your annual leave nums isn't enough")
        else:
            sub_residue(holiday.worker, long)

    if json_holiday.get('holiday_reason'):
        holiday.reason = json_holiday.get('holiday_reason')

    holiday_over = json_holiday.get('holiday_over')

    # cancel the apply holiday
    if holiday_over:
        if holiday.type == 2:
            add_residue(holiday.worker, old_long)
        holiday.apply_over = True

    if HolidayType.query.get(type):
        holiday.type = type

    holiday.apply_ok = 0
    holiday.apply_state = 0

    add_to_db(holiday)
    return jsonify({'message': 'your modify your holiday apply'})


@api.route('/worker/workadds')
def get_workadds_info():
    workadds = g.current_user.workadds
    info = []
    for workadd in workadds:
        info.append(workadd.to_json())
    return jsonify({"workadds": info})


@api.route('/worker/workadds', methods=['POST'])
def create_wordadd():
    json_holiday = request.json
    worker_id = g.current_user.id
    add_start = json_holiday.get('workadd_time_begin')
    add_end = json_holiday.get('workadd_time_end')
    add_reason = json_holiday.get('workadd_reason')

    workadd = WorkAdd(worker_id=worker_id, add_start=add_start, add_end=add_end, add_reason=add_reason,
                      apply_time=date.today())

    add_to_db(workadd)

    if workadd.add_start > workadd.add_end:
        delete_to_db(workadd)
        return bad_request('workadd start laster than end')

    if add_reason is None or add_reason == "":
        delete_to_db(workadd)
        return bad_request('workadd must have reason')

    return jsonify({
        'workadd_id': workadd.id
    }), 201


@api.route('/worker/workadds/<int:id>', methods=['PUT'])
def modify_the_workadd(id):
    workadd = WorkAdd.query.filter(WorkAdd.id == id).first()

    if workadd is None:
        return bad_request("the workadd isn't exit")

    if workadd.worker_id != g.current_user.id:
        return bad_request("your can't modify the holiday isn't belong you")

    if workadd.add_state == 1:
        return bad_request("your can't modify the workadd is ok")

    json_workadd = request.json
    add_start = json_workadd.get('workadd_start')
    add_end = json_workadd.get('workadd_end')
    add_reason = json_workadd.get('workadd_reason')

    add_end = add_end if add_end else workadd.add_end
    add_start = add_start if add_start else workadd.add_start

    old_end = workadd.add_end
    old_start = workadd.add_start

    workadd.add_start = add_start
    workadd.add_end = add_end

    add_to_db(workadd)

    if workadd.add_start > workadd.add_end:
        workadd.add_end = old_end
        workadd.add_start = old_start
        delete_to_db(workadd)
        return bad_request('the start latter than end')

    if add_reason:
        workadd.add_reason = add_reason

    workadd.add_state = 0

    add_to_db(workadd)
    return jsonify({'message': 'you modify your workadd'})

