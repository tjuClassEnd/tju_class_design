#!/usr/bin/env python
# encoding=utf-8

from flask import Blueprint

admin_api = Blueprint('admin', __name__)

from . import authentication, errors, admin