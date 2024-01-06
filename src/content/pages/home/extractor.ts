import { stringToColor } from "utils/color";
import { constructInterval } from "utils/interval";
import { extractLesson } from "../calendar/extractor";
import { DateTime } from "luxon";
import { extractSchool } from "utils/page";
import { toTitleCase } from "utils/string";

export const extractLessons = (html: Document) => {
    const elements = Array.from<HTMLAnchorElement>(html.querySelectorAll("div#s_m_Content_Content_skemaIsland_pa > div[role='heading'] > a"));
    const lessons = elements.map(element => extractLesson(element)).map(lesson => {
        return {
            color: stringToColor(lesson.hold ?? "", 100, 90).string,
            textColor: stringToColor(lesson.hold ?? "", 100, 30).string,
            class: lesson.hold ?? "",
            id: lesson.absid,
            link: `/lectio/${extractSchool(document.location)}/aktivitet/aktivitetforside2.aspx?absid=${lesson.absid}`,
            interval: constructInterval(lesson.tidspunkt),
            name: lesson.navn?.replace("prv.", "prøve").replace("mdt.", "mundtlig").replace("skr.", "skriftlig") ?? "",
            note: lesson.andet ?? "",
            room: lesson.lokale ?? "",
            status: lesson.status ?? "",
            teacher: lesson.lærer ?? "",
        }
    });
    const days: { label: string, lessons: typeof lessons }[] = [];
    for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        const day = lesson.interval.start?.hasSame(DateTime.now(), "day") ? "I dag" : (lesson.interval.start?.hasSame(DateTime.now().plus({ days: 1 }), "day") ? "I morgen" : toTitleCase(lesson.interval.start?.toFormat("EEEE d/M") ?? "")) ?? "N/A";
        if (days.find(day_ => day_.label === day) === undefined) {
            days.push({ label: day, lessons: [lesson] });
        } else {
            days.find(day_ => day_.label === day)?.lessons.push(lesson);
        }
    }

    return days
};