#!/usr/bin/env python
# encoding=utf-8

from ..models import Permission
from .. import db


def check_really_degree(degree):
    if degree.degree_id in [2, 3, 4, 5]:
        degree_id = degree.degree_id
    elif degree.can(Permission.MANAGE_HOLIDAY_ONE):
        degree_id = 2
    elif degree.can(Permission.MANAGE_HOLIDAY_TWO):
        degree_id = 3
    elif degree.can(Permission.MANAGE_HOLIDAY_THREE):
        degree_id = 4
    elif degree.can(Permission.MANAGE_HOLIDAY_FOUR):
        degree_id = 5
    else:
        degree_id = 1

    return degree_id


def add_to_db(model):
    db.session.add(model)
    db.session.commit()


def delete_to_db(model):
    db.session.delete(model)
    db.session.commit()


def add_residue(worker, long):
    worker.year_holidays_residue += long
    worker.year_holidays_used -= long


def sub_residue(worker, long):
    worker.year_holidays_residue -= long
    worker.year_holidays_used += long
