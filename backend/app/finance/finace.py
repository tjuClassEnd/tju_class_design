#!/usr/bin/env python
# encoding=utf-8

from datetime import date, datetime, timedelta

from flask import jsonify, request, g

from app.util import add_to_db, delete_to_db, add_residue, sub_residue
from . import finace_api
from .errors import bad_request, validation_error
from ..models import Admin, Worker, WorkerDegree, Degree, WorkAdd, WorkaddInfo


@finace_api.route('/users/<string:id>')
def get_workeradds_info(id):
    worker = Worker.query.get(id)

    if not worker:
        return bad_request('don\'t exit the worker')

    search_begin = request.args.get('search_begin')
    search_end = request.args.get('search_end')

    search_begin = datetime.strptime(search_begin, '%Y-%m-%d') if search_begin else None
    search_end = datetime.strptime(search_end, '%Y-%m-%d') if search_end else None

    query = WorkAdd.query.filter(WorkAdd.worker_id == worker.id, WorkAdd.add_state == 1)

    if search_begin:
        query = query.filter(WorkAdd.add_start >= search_begin)
    if search_end:
        query = query.filter(WorkAdd.add_end <= search_end)

    worker_adds = query.all()

    total_time = timedelta()
    for worker_add in worker_adds:
        total_time += (worker_add.add_end - worker_add.add_start)

    workadd_info = []
    workadd_types = WorkaddInfo.query.all()
    for workadd_type in workadd_types:
        workadd_info.append([workadd_type.id, workadd_type.name, 0])

    for workadd in worker_adds:
        for workadd_one in workadd_info:
            if workadd.type == workadd_one[0]:
                workadd_one[2] += (workadd.add_end - workadd.add_start).total_seconds() / 3600

    info = []
    for workadd in worker_adds:
        info.append(workadd.to_json())

    return jsonify({'total_add(hours)': total_time.total_seconds() / 3600,
                    'specific_add(hours)': workadd_info,
                    'workadds': info})
