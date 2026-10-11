import { makeAutoObservable, toJS } from 'mobx';
import {
  CourseLines,
  normalizeCourseData,
} from '../../../EditCourseByID/course-data';
import { CourseReadData } from '../../../course-api';
import { FILE_URL } from '../../../../../settings';

export interface positionDataI {
  activePage: number;
  selectedPage?: number;
  selectedRow?: number;
  selectedIndex?: number;
}

export class CourseMicroStoreByID {
  constructor(id: number) {
    this.id = id;
    makeAutoObservable(this);
  }

  id?: number;

  changeID = (course_id?: number) => {
    if (this.id !== course_id) {
      this.courseData = [];
      this.courseName = undefined;
      this.courseImage = undefined;
      this.author = null;
      this.mainLineIndex = null;
    }
    this.id = course_id;
  };

  // -------Данные курса -----------------------
  courseName?: string;
  courseData = CourseLines;

  positionData: positionDataI = {
    activePage: 1,
  };

  get course() {
    return toJS(this.courseData);
  }

  get position() {
    return toJS(this.positionData);
  }

  // ------Стрелочная навигация и получение ID карточки--------------

  get_card_id_by_position(
    selected_position: positionDataI,
  ): string | number | null {
    if (selected_position) {
      try {
        return this.course[Number(selected_position.selectedRow)].SameLine[
          Number(selected_position.selectedPage) - 1
        ].CourseFragment[Number(selected_position.selectedIndex)]?.CourseElement
          ?.id;
      } catch {
        return null;
      }
    } else {
      return null;
    }
  }

  getPositionByArrow = (arrow: 'Back' | 'Down' | 'Up' | 'Next') => {
    const scannedPosition = toJS(this.positionData);
    if (arrow == 'Back') {
      scannedPosition.selectedIndex = Number(scannedPosition.selectedIndex) - 1;
    }
    if (arrow == 'Down') {
      scannedPosition.selectedRow = Number(scannedPosition.selectedRow) + 1;
    }
    if (arrow == 'Up') {
      scannedPosition.selectedRow = Number(scannedPosition.selectedRow) - 1;
    }
    if (arrow == 'Next') {
      scannedPosition.selectedIndex = Number(scannedPosition.selectedIndex) + 1;
    }
    return scannedPosition;
  };

  getCardIDByArrow(arrow: 'Back' | 'Down' | 'Up' | 'Next') {
    const scannedPosition = this.getPositionByArrow(arrow);
    return this.get_card_id_by_position(scannedPosition);
  }

  // arrowClick(arrow: "Back" | "Down" | "Up" | "Next"){
  //     this.isPositionChanged = true
  //     this.positionData = this.getPositionByArrow(arrow)
  // }

  // ----------------------------------------------------------------

  isPositionChanged = false;

  changeActivePage = (e, value: number) => {
    this.isPositionChanged = true;
    this.positionData.activePage = value;
  };
  setActivePage = (value: number) => {
    this.changeActivePage(null, value);
  };

  changeCourseName = (course_name?: string) => {
    if (course_name) {
      this.courseName = course_name.replace(/\[.*?\]/g, '');
    } else {
      this.courseName = 'Название курса по умолчанию';
    }
  };

  author: CourseReadData['users_customuser'] = null;
  applyCourseData(course: CourseReadData) {
    if (course.id !== this.id) return;
    this.changeCourseName(course.name ?? undefined);
    this.courseData = normalizeCourseData(course.course_data);
    this.mainLineIndex =
      Number((course.name || '').match(/\[(.*?)\]/)?.[1]) - 1;
    this.courseImage = course.cards_cardcourseimage?.image
      ? `${FILE_URL}/${course.cards_cardcourseimage.image}`
      : undefined;
    this.author = course.users_customuser;
  }

  // Игнорирование URL роутинга, нужно для использования в качестве селектора

  isIgnoreRouteAfterSelect?: boolean = false;
  changeIsIgnoreRouteAfterSelect = (ignore_or_not: boolean | undefined) => {
    this.isIgnoreRouteAfterSelect = ignore_or_not;
  };

  // --------Изображение для курса------------------------------------------------
  courseImage?: string;

  // ------------------------------------------------------------------------------------------------

  viewedCardIDs: Set<string> = new Set();

  mainLineIndex = null as number | null;
}
