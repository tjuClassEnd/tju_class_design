#!/usr/bin/env python
# encoding=utf-8

from datetime import date

from flask import jsonify, request, g, abort, url_for, current_app
from . import api
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


@api.route('/worker/holidays/<int:id>', methods=['PUT'])
def modify_the_holiday(id):
    holiday = Holiday.query.filter(Holiday.id == id).first()

    if holiday is None:
        return bad_request("the holiday isn't exit")

    if holiday.worker_id != g.current_user.id:
        return bad_request("your can't modify the holiday isn't belong you")

    json_holiday = request.json
    holiday_end = json_holiday.get('holiday_end')

    if holiday_end:
        if holiday.apply_ok != 1:
            return bad_request('your can apply to end the holiday maybe in check or apply faily')
        holiday.apply_end = True
        db.session.add(holiday)
        db.session.commit()
        return jsonify({"message": "your apply to end the holiday"})

    if holiday.apply_ok == 1:
        return bad_request("you can't modify the apply ok holiday")

    if holiday.apply_state not in [0, -1] and holiday.apply_ok != -1:
        return bad_request("you can't modify the holiday in check")

    holiday_time_begin = json_holiday.get("holiday_begin_time")
    holiday_time_end = json_holiday.get("holiday_end_time")
    type = json_holiday.get('holiday_type')

    holiday_time_begin = holiday_time_begin if holiday_time_begin else holiday.holiday_time_begin
    holiday_time_end = holiday_time_end if holiday_time_end else holiday.holiday_time_end

    if holiday_time_begin > holiday_time_end:
        return bad_request('begin is latter than end')

    holiday.holiday_time_begin = holiday_time_begin
    holiday.holiday_time_end = holiday_time_end

    if json_holiday.get('holiday_reason'):
        holiday.reason = json_holiday.get('holiday_reason')

    if HolidayType.query.get(type):
        holiday.type = type

    holiday.apply_ok = 0
    holiday.apply_state = 0

    db.session.add(holiday)
    db.session.commit()
    return jsonify({'message': 'yoo modify your holiday apply'})


@api.route('/worker/holidays', methods=['POST'])
def create_holiday():
    json_holiday = request.json
    holiday_type = json_holiday.get('holiday_type')
    worker_id = g.current_user.id
    holiday_time_begin = json_holiday.get('holiday_time_begin')
    holiday_time_end = json_holiday.get('holiday_time_end')
    # apply_time = json_holiday.get('holiday_apply_time')
    reason = json_holiday.get('holiday_reason')
    # end_time = json_holiday.get('holiday_end_time')

    if holiday_time_begin > holiday_time_end:
        return bad_request('begin is latter than end')

    if reason is None:
        return bad_request('you need reason to apply')

    if HolidayType.query.get(holiday_type) is None:
        return bad_request('the holiday type not exit')

    holiday = Holiday(type=holiday_type, worker_id=worker_id, holiday_time_begin=holiday_time_begin,
                      holiday_time_end=holiday_time_end, apply_time=date.today(), reason=reason)

    db.session.add(holiday)
    db.session.commit()
    return jsonify({
        'holiday_id': holiday.id
    }), 201


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

    if add_start > add_end:
        return bad_request('workadd start laster than end')

    if add_reason is None:
        return bad_request('workadd must have reason')

    workadd = WorkAdd(worker_id=worker_id, add_start=add_start, add_end=add_end, add_reason=add_reason,
                      apply_time=date.today())

    db.session.add(workadd)
    db.session.commit()
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

    if add_start > add_end:
        return bad_request('the start latter than end')

    workadd.add_end = add_end
    workadd.add_start = add_start

    if add_reason:
        workadd.add_reason = add_reason

    workadd.add_state = 0

    db.session.add(workadd)
    db.session.commit()
    return jsonify({'message': 'you modify your workadd'})


