#!/usr/bin/env python
# encoding=utf-8

from datetime import date

from flask import jsonify, request, g

from app.util import add_to_db, delete_to_db, add_residue, sub_residue
from . import admin_api
from .errors import bad_request, validation_error
from ..models import Admin, Worker, WorkerDegree


@admin_api.route('/users/')
def get_worker_info():
    workers = Worker.query.filter(1 == 1).all()
    info = []
    for worker in workers:
        info.append(worker.to_json())
    return jsonify({"workers": info})


@admin_api.route('/users/', methods=['POST'])
def add_worker():
    json_worker = request.json
    id = json_worker.get('worker_id')
    name = json_worker.get('worker_name')
    email = json_worker.get('worker_email')
    address = json_worker.get('worker_address')
    password = json_worker.get('password')

    worker = Worker(id=id, name=name, email=email, address=address, password=password)

    try:
        add_to_db(worker)
    except Exception:
        raise validation_error("your enter same error")

    return jsonify({'message': "add the new worker"})

@admin_api.route('/users/<string:id>/degree', methods=["POST"])
def add_degree_to_worker(id):
    json_worker = request.json
    department_id = json_worker.get('degree_department_id')
    degree_id = json_worker.get('degree_degree_id')
    worker_id = id

    worker_degree = WorkerDegree(degree_id=degree_id, department_id=department_id, worker_id=worker_id)

    add_to_db(worker_degree)

    return jsonify({'message': 'your add the degree to worker {}'.format(id)})


