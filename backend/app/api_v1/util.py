#!/usr/bin/env python
# encoding=utf-8

from ..models import Permission


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
