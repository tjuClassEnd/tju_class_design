#!/usr/bin/env python
# encoding=utf-8

from flask_script import Manager, Shell
from flask_migrate import Migrate, MigrateCommand

from app import create_app, db
from app.models import Degree, Department, WorkerDegree, Worker, HolidayType, Holiday, Admin, WorkaddInfo

app = create_app('production')
manager = Manager(app)
migrate = Migrate(app, db)


def make_shell_context():
    return dict(app=app, db=db, Degree=Degree, Department=Department, WorkerDegree=WorkerDegree,
                Worker=Worker, HolidayType=HolidayType, Holiday=Holiday, Admin=Admin, WorkaddInfo=WorkaddInfo)

manager.add_command('shell', Shell(make_context=make_shell_context))
manager.add_command('db', MigrateCommand)


@app.route('/')
def hehe():
    return 'hello'

@manager.command
def test():
    """Run the unit tests."""
    import unittest
    tests = unittest.TestLoader().discover('tests', pattern='worker_apply_test.py')
    unittest.TextTestRunner(verbosity=2).run(tests)


if __name__ == '__main__':
    manager.run()
