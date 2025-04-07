define([
  '../models/course',
  '../coordUtils',
  '../pathfinding',
  './svgUtil',
  './constants',
  'modules/pathboard/store',
  'modules/pathboard/common/courseHelper'
], function (
  Course,
  coordUtils,
  pathfinding,
  { generateSvgEl, generateTriangle },
  Constants,
  store,
  CourseHelper
) {


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
    horizontal: 30
  };

  return class ArrowsView {
    constructor({ course, board }) {
      this.showCourseTransitions = this.showCourseTransitions.bind(this);
      this.course = course;
      this.board = board;
      this.transitionIconPositions = {};
      this.containerEl = this.board.$el;
      this.course.elements.on('add remove move', this.showCourseTransitions);
      this.course.transitions.on('add remove', this.showCourseTransitions);
    }
  }
});
