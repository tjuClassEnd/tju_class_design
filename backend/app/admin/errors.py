#!/usr/bin/env python
# encoding=utf-8

from flask import jsonify
from app.exceptions import ValidationError
from . import admin_api


def bad_request(message):
    print(message)
    response = jsonify({'error': 'bad request', 'message': message})
    print(message)
    response.status_code = 400
    print(response)
    print('hehe')
    return response


def unauthorized(message):
    response = jsonify({'error': 'unauthorized', 'message': message})
    response.status_code = 401
    return response


def forbidden(message):
    response = jsonify({'error': 'forbidden', 'message': message})
    response.status_code = 403
    return response


@admin_api.errorhandler(ValidationError)
def validation_error(e):
    print('hehe123', type(e))
    return bad_request(str(e))
