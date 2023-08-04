define(function (require) {
    const React = require('react');
    const Loading = require('ui/react/loading');
    const Layout = require('ui/react/layout/layout');
    const Header = require('ui/react/layout/header');
    const Content = require('ui/react/layout/content');

    const ClassworkAttemptsList = require('./classworkAttemptsList');
    const ClassworkAssessmentModal = require('./classworkAssessmentModal');
    const ClassworkTask = require('./classworkTask');
    const ModalWithArrow = require('ui/react/modal/modalWithArrow');
    const StatisticsUsersHelpers = require('common/helpers/statisticsUsersHelpers');

    // store
    const Actions = require('stores/course/statistics/users/action');
    const ActionsModeration = require('stores/classwork/moderation/actions');
    const entities = require('stores/course/statistics/users/entities');
    const { moderationStoreInstance } = require('stores/classwork/moderation/store');
    const { dispatcherRegister } = require('stores/course/statistics/users/store');
    const storeDecorator = require('flux/storeDecorator');
    const L = require('i18n').getBundle().peerAssessment;


    dispatcherRegister(moderationStoreInstance);
    return storeDecorator(ClassworkPage, [moderationStoreInstance]);
});
