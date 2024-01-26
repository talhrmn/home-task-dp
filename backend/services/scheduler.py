from apscheduler.schedulers.asyncio import AsyncIOScheduler

from controllers.monitor import MonitorDB, MonitorData
from controllers.settings import SettingsDB

scheduler = AsyncIOScheduler()


class Scheduler:
    def __init__(self):
        self.interval = None
        self.job = None

    def start(self):
        # Schedule the task to run on set interval
        self.interval = SettingsDB().get_settings()['time_interval']
        self.job = scheduler.add_job(self.run_task, "interval", seconds=self.interval)
        scheduler.start()

    def set_interval(self, interval):
        self.job.reschedule(trigger="interval", seconds=interval)

    def stop(self):
        scheduler.shutdown()

    async def run_task(self):
        monitors = MonitorDB().get_all_monitors()
        for monitor in monitors:
            await MonitorDB().update_monitor(monitor['monitor_id'],
                                             MonitorData(site_url=monitor['site_url'], site_name=monitor['site_name']))


scheduler_controller = Scheduler()
