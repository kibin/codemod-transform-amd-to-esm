import Course from "../models/course";
import coordUtils from "../coordUtils";
import pathfinding from "../pathfinding";
import __svgUtil from "./svgUtil";
import Constants from "./constants";
import store from "modules/pathboard/store";
import CourseHelper from "modules/pathboard/common/courseHelper";
const { generateSvgEl, generateTriangle } = __svgUtil;

const cellSize = coordUtils.cellSize();

const TRANSITION_ICON_SIZE = 32;

const SLIDE_SIZE = {
  survey: [
    [40, 40],
    [50, 50],
  ],
};

const ALLEY_WIDTH = {
  vertical: 60,
  horizontal: 30,
};
export default (class ArrowsView {
  constructor({ course, board }) {
    this.showCourseTransitions = this.showCourseTransitions.bind(this);
    this.course = course;
    this.board = board;
    this.transitionIconPositions = {};
    this.containerEl = this.board.$el;
    this.course.elements.on("add remove move", this.showCourseTransitions);
    this.course.transitions.on("add remove", this.showCourseTransitions);
  }
});

