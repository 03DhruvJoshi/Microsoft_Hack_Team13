"""Generate ICS calendar files from roadmap data."""
from datetime import datetime, timedelta
import uuid


def _parse_duration_minutes(time_str: str) -> int:
    t = time_str.strip().lower()
    if "h" in t and "m" in t:
        h, rest = t.split("h")
        return int(h) * 60 + int(rest.replace("m", "").strip())
    if "h" in t:
        return int(t.replace("h", "").strip()) * 60
    return int(t.replace("m", "").strip())


def generate_ics(roadmap_data: dict, interview_date_str: str = "") -> bytes:
    try:
        interview_date = datetime.strptime(interview_date_str, "%Y-%m-%d")
    except (ValueError, TypeError):
        interview_date = datetime.utcnow() + timedelta(weeks=3)

    start_date = interview_date - timedelta(weeks=3)
    role = roadmap_data.get("role", "Interview")
    company = roadmap_data.get("company", "Company")

    lines: list[str] = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//PrepPath//PrepPath Interview Prep//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "X-WR-CALNAME:PrepPath Interview Prep",
        "X-WR-TIMEZONE:UTC",
    ]

    for week in roadmap_data.get("weeks", []):
        week_num = week.get("num", 1)
        week_start = start_date + timedelta(weeks=(week_num - 1))

        for i, task in enumerate(week.get("tasks", [])):
            # Spread tasks across Mon–Fri (0=Mon)
            task_date = week_start + timedelta(days=(i * 2) % 5)
            minutes = _parse_duration_minutes(task.get("time", "30m"))

            dtstart = task_date.replace(hour=9, minute=0, second=0, microsecond=0)
            dtend = dtstart + timedelta(minutes=minutes)

            desc = (
                f"Type: {task.get('type', 'Practice')}\\n"
                f"Duration: {task.get('time', '30m')}\\n\\n"
                f"Part of your PrepPath prep for {role} at {company}."
            )

            lines += [
                "BEGIN:VEVENT",
                f"UID:{uuid.uuid4()}",
                f"DTSTAMP:{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}",
                f"DTSTART:{dtstart.strftime('%Y%m%dT%H%M%SZ')}",
                f"DTEND:{dtend.strftime('%Y%m%dT%H%M%SZ')}",
                f"SUMMARY:PrepPath – Week {week_num}: {task.get('title', 'Prep Task')}",
                f"DESCRIPTION:{desc}",
                f"CATEGORIES:{task.get('type', 'Practice')}",
                "BEGIN:VALARM",
                "ACTION:DISPLAY",
                "DESCRIPTION:PrepPath session starting in 1 hour",
                "TRIGGER:-PT1H",
                "END:VALARM",
                "STATUS:CONFIRMED",
                "END:VEVENT",
            ]

    # Final interview event
    i_start = interview_date.replace(hour=10, minute=0, second=0, microsecond=0)
    i_end = interview_date.replace(hour=11, minute=0, second=0, microsecond=0)
    lines += [
        "BEGIN:VEVENT",
        f"UID:{uuid.uuid4()}",
        f"DTSTAMP:{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}",
        f"DTSTART:{i_start.strftime('%Y%m%dT%H%M%SZ')}",
        f"DTEND:{i_end.strftime('%Y%m%dT%H%M%SZ')}",
        f"SUMMARY:INTERVIEW: {role} at {company}",
        f"DESCRIPTION:Your interview for {role} at {company}.\\n\\nPrepared with PrepPath.",
        "CATEGORIES:Interview",
        "PRIORITY:1",
        "STATUS:CONFIRMED",
        "END:VEVENT",
    ]

    lines.append("END:VCALENDAR")
    return "\r\n".join(lines).encode("utf-8")
