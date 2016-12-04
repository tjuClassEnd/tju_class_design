#!/usr/bin/env python
# encoding=utf-8

from datetime import datetime

from flask import current_app, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer

from . import db


class Permission:
    # normal worker
    APPLY_HOLIDAY = 0x01
    APPLY_WORK = 0x02

    # diff degree to manage the holiday
    MANAGE_HOLIDAY_ONE = 0x04
    MANAGE_HOLIDAY_TWO = 0x08
    MANAGE_HOLIDAY_THREE = 0x10
    MANAGE_HOLIDAY_FOUR = 0x20

    MANAGE_WORK = 0x40

    ADMINISTER = 0x80


class Degree(db.Model):
    __tablename__ = 'degree'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    default = db.Column(db.Boolean, default=False, index=True)
    permissions = db.Column(db.Integer)
    worker = db.relationship('WorkerDegree', backref='degree')

    @staticmethod
    def insert_degrees():
        degrees = {
            'WORK': (Permission.APPLY_HOLIDAY |
                     Permission.APPLY_WORK,
                     True, 1),

            'CHIEF': (Permission.APPLY_HOLIDAY |
                      Permission.APPLY_WORK |
                      Permission.MANAGE_HOLIDAY_ONE |
                      Permission.MANAGE_WORK,
                      False, 2),

            'MINISTER': (Permission.APPLY_HOLIDAY|
                         Permission.APPLY_WORK|
                         Permission.MANAGE_HOLIDAY_TWO|
                         Permission.MANAGE_WORK,
                         False, 3),

            'Manager': (Permission.APPLY_HOLIDAY|
                        Permission.APPLY_WORK|
                        Permission.MANAGE_HOLIDAY_THREE|
                        Permission.MANAGE_WORK,
                        False, 4),

            'CEO': (Permission.APPLY_HOLIDAY|
                    Permission.APPLY_WORK|
                    Permission.MANAGE_HOLIDAY_FOUR|
                    Permission.MANAGE_WORK,
                    False, 5),

            'Administrator': (0xff, False, 100)
        }
        for d in degrees:
            degree = Degree.query.filter_by(name=d).first()
            if degree is None:
                degree = Degree(id=degrees[d][2], name=d)
            degree.permissions = degrees[d][0]
            degree.default = degrees[d][1]
            db.session.add(degree)
        db.session.commit()

    def __repr__(self):
        return '<Degree {}>'.format(self.name)


class Department(db.Model):
    __tablename__ = 'department_info'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    worker_degree_info = db.relationship('WorkerDegree', backref='department')

    @staticmethod
    def insert_departments():
        departments = {
            'Engineering Department': (1, 'Engineering Department'),
            'Research Department': (2, 'Research Department'),
            'Human Resources Department': (3, 'Human Resources Department'),
            'Ministry of foreign trade and business': (4, 'Ministry of foreign trade and business')
        }

        for d in departments:
            department = Department.query.filter_by(name=d).first()
            if department is None:
                department = Department(id=departments[d][0], name=departments[d][1])
            db.session.add(department)
        db.session.commit()


class WorkerDegree(db.Model):
    __tablename__ = 'worker_degree'
    department_id = db.Column(db.Integer, db.ForeignKey('department_info.id'), primary_key=True)
    degree_id = db.Column(db.Integer, db.ForeignKey('degree.id'), primary_key=True)
    worker_id = db.Column(db.String(64), db.ForeignKey('worker.id'), primary_key=True)

    # verify the permission
    def can(self, permissions):
        return self.degree is not None and (self.degree.permissions & permissions) == permissions

    def __init__(self, **kwargs):
        super(WorkerDegree, self).__init__(**kwargs)
        self.department_id = kwargs.get('department_id', 1)
        self.degree_id = kwargs.get('degree_id', None)
        self.worker_id = kwargs.get('worker_id')
        if self.degree_id is None:
            if self.worker_id == current_app.config['FLASKY_ADMIN']:
                self.degree = Degree.query.filter_by(permissions=0xff).first()
            if self.degree is None:
                self.degree = Degree.query.filter_by(default=True).first()


class Worker(db.Model):
    __tablename__ = 'worker'
    id = db.Column(db.String(64), primary_key=True)
    name = db.Column(db.String(64))
    email = db.Column(db.String(64))
    address = db.Column(db.String(64))
    password_hash = db.Column(db.String(128))
    year_holidays_residue = db.Column(db.Integer, default=7)
    year_holidays_used = db.Column(db.Integer, default=0)
    workAdd_time = db.Column(db.Integer, default=0)
    degree_infos = db.relationship('WorkerDegree', backref='worker')
    holidays = db.relationship('Holiday', backref='worker')
    workadds = db.relationship('WorkAdd', backref='worker')

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_auth_token(self, expiration):
        s = Serializer(current_app.config['SECRET_KEY'],
                       expires_in=expiration)
        return s.dumps({'id': self.id}).decode('ascii')

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return None
        return Worker.query.get(data['id'])


class HolidayType(db.Model):
    __tablename__ = 'holiday_type'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    holiday = db.relationship('Holiday', backref='holiday_type')

    @staticmethod
    def insert_holiday_types():
        holiday_types = {
            'Leave on business': (1, 'Leave on business'),
            'Annual leave': (2, 'Annual leave'),
            'Sick leave': (3, 'Sick leave'),
            'Funeral leave': (4, 'Funeral leave'),
            'Compassionate leave': (5, 'compassionate leave'),
            'Maternity leave': (6, 'Maternity leave'),
            'Marriage leave': (7, 'Marriage leave'),
            'Maternity leave': (8, 'Maternity leave')
        }

        for h in holiday_types:
            holiday_type = HolidayType.query.filter_by(name=h).first()
            if holiday_type is None:
                holiday_type = HolidayType(id=holiday_types[h][0], name=holiday_types[h][1])
            db.session.add(holiday_type)
        db.session.commit()


class Holiday(db.Model):
    __tablename__ = 'holiday'
    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.String(64), db.ForeignKey('worker.id'), primary_key=True)
    type = db.Column(db.Integer, db.ForeignKey('holiday_type.id'), primary_key=True)
    holiday_time_begin = db.Column(db.Date)
    holiday_time_end = db.Column(db.Date)
    apply_time = db.Column(db.Date, default=datetime.utcnow)
    reason = db.Column(db.Text)
    end_time = db.Column(db.Date)

    '''
    start of apply, set the apply_state:0, apply_ok:0, apply_over: false, apply_end: false

    diff level check, set the apply_state: 1, 2, 3, if all of check, then set apply_ok: 1
    if not allow the holiday, set the apply_state: level of the check, apply_ok: -1

    when apply_ok: -1 or apply_state: 0, you can modifi the apply info, the reapply the holiday:
    set the apply_state:0 apply_ok: 0

    when apply_state:0 or apply_ok: -1, can cancel the apply:
    set the apply_state: -1, apply_end = true

    when you over your holiday and you go to work, you can apply to over the holiday
    so when apply_ok: 1
    set: apply_over: true, if check is ok then set: apply_end: 1.
    '''
    # -1: cancel, 0: start, 1: one level checkok, 2:..., 3:...
    apply_state = db.Column(db.Integer, default=0)
    # 0: in check, -1: not allow, 1: ok allow
    apply_ok = db.Column(db.Integer, default=0)
    # True: working. the holiday is over.
    apply_over = db.Column(db.Boolean, default=False)
    # True: request to end the holiday and start to work
    apply_end = db.Column(db.Boolean, default=False)

    def to_json(self):
        json_holiday = {
            # 'url': url_for('api.get_user', id=self.id, _external=True),
            'holiday_id': self.id,
            'holiday_worker_id': self.worker_id,
            'holiday_type': self.type,
            'holiday_time_begin': self.holiday_time_begin.isoformat(),
            'holiday_time_end': self.holiday_time_end.isoformat(),
            'holiday_apply_time': self.apply_time,
            'holiday_reason': self.reason,
            'holiday_end_time': self.end_time,
            'holiday_apply_state': self.apply_state,
            'holiday_apply_ok': self.apply_ok,
            'holiday_app_over': self.apply_over,
            'holiday_app_end': self.apply_end
        }
        return json_holiday


class WorkAdd(db.Model):
    __tablename__ = 'work_add'
    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.String(64), db.ForeignKey('worker.id'), primary_key=True)
    apply_time = db.Column(db.DateTime, default=datetime.utcnow)
    add_start = db.Column(db.DateTime)
    add_end = db.Column(db.DateTime)
    add_reason = db.Column(db.Text)
    # 0: wait check, -1: not allow, 1: allow
    add_state = db.Column(db.Integer, default=0)

    def to_json(self):
        json_workadd = {
            'workadd_id': self.id,
            'workadd_worker_id': self.worker_id,
            'workadd_apply_time': self.apply_time,
            'workadd_start_time': self.add_start,
            'workadd_end_time': self.add_end,
            'workadd_reason': self.add_reason,
            'workadd_add_state': self.add_state
        }
        return json_workadd


