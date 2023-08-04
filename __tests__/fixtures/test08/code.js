define(function (require) {
    let SamplesModel;
    const Backbone = require('backbone');
    const Samples = require('../samples');
    const PageModel = require('./page');
    const generateDefaultName = require('utils/generateDefaultName');
    const backendValidation = require('base/backendValidation');
    const notify = require('ui/notify');
    const i18n = require('i18n');
    const samplesL = i18n.getBundle().redactor.samples;

    const fetchLimit = require('appConfig').PAGE_SIZE;

    class Sample extends Backbone.Model {
        static initClass() {

            this.prototype.defaults =
                { isSelected: false };
        }

        saveName(name) {
            this.set({ name });
            return $.ajax({
                type: 'PUT',
                url: '/api/courses/pages/layouts/' + this.id,
                contentType: 'application/json',
                data: JSON.stringify({ name })
            });
        }

        samplePreview() {
            return this.collection.samplePreview(this);
        }

        markShapes() {
            return __guard__(__guard__(this.get('content'), x1 => x1.shapes), x => x.forEach(shape => shape.previewInSamplePanel = true));
        }
    }
    Sample.initClass();


    class CustomSamples extends Backbone.Collection {
        static initClass() {

            this.prototype.url = '/api/courses/pages/layouts';

            this.prototype.model = Sample;

            this.prototype._totalCount = 0;
        }

        initialize(samples, { samplesModel }) {
            this.samplesModel = samplesModel;
        }

        parse(response) {
            return response.data.layouts;
        }

        fetch() {
            return super.fetch({ url: this.url + '?limit=' + fetchLimit }).then(({ data }) => {
                this.isFetched = true;
                this.markShapes();
                return this._totalCount = data.totalCount;
            });
        }

        samplePreview(sample) {
            return this.samplesModel.samplePreview(sample);
        }

        generateSampleName() {
            return generateDefaultName(samplesL.template_name,
                this.toJSON().reverse().map(item => item.name));
        }

        markShapes() {
            return this.models.forEach(s => s.markShapes());
        }

        getTotalCount() {
            return this._totalCount;
        }
    }
    CustomSamples.initClass();

    class DefaultSamples extends Backbone.Collection {
        static initClass() {

            this.prototype.model = Sample;
        }

        samplePreview(sample) {
            return this.samplesModel.samplePreview(sample);
        }

        constructor(samples, { samplesModel }) {
            this.samplesModel = samplesModel;
            super(...arguments);
            this.isFetched = true;
            this.reset(Samples.map(function (sampleData) {
                const data = {
                    name: samplesL.defaultNames[sampleData.id],
                    id: sampleData.id,
                    // Немного нормализуем данные по дефолтным шаблонам, подгоняя их под
                    // формат страницы
                    content: {
                        pageAttrs: {},
                        shapes: sampleData.shapes
                    }
                };
                return JSON.parse(JSON.stringify(data));
            })
            );

            this.models.forEach(s => s.markShapes());
        }
    }
    DefaultSamples.initClass();


    return SamplesModel = class SamplesModel extends Backbone.Model {

        initialize({ redactor }) {
            this.redactor = redactor;
            this.customSamples = new CustomSamples([], { samplesModel: this });
            this.defaultSamples = new DefaultSamples([], { samplesModel: this });
            return this.set({ tab: 'default' });
        }

        saveAsSample() {
            return this.redactor.getPage().saveAsSample({
                name: this.customSamples.generateSampleName()
            })
                .fail(backendValidation(({ error }) => notify.error(i18n.getMessage(error))))
                .then(response => {
                    if (this.customSamples.isFetched) {
                        const newSample = new Sample(response.data);
                        newSample.markShapes();
                        this.customSamples.unshift(newSample);
                        return $.Deferred().resolve();
                    }
                    return this.customSamples.fetch();

                }).then(() => {
                    return this.set({
                        tab: 'custom'
                    });
                });
        }

        clearSelected() {
            this.customSamples.forEach(s => s.set({ isSelected: false }));
            this.defaultSamples.forEach(s => s.set({ isSelected: false }));
            return this.unset('selectedSample');
        }

        samplePreview(selectedSample) {
            this.clearSelected();
            this.set({ selectedSample });
            selectedSample.set({ isSelected: true });
            // this is magic
            const data = JSON.parse(JSON.stringify(selectedSample.toJSON()));
            new PageModel(data, { previewMode: true });
            return this.redactor.getPage().samplePreview(data);
        }

        sampleCancel() {
            this.clearSelected();
            return this.redactor.getPage().sampleCancel();
        }

        sampleUse() {
            this.clearSelected();
            return this.redactor.getPage().sampleUse();
        }

        selectTab(tab) {
            this.set({ tab });
            return this.fetchCollection();
        }

        fetchCollection() {
            const coll = {
                default: this.defaultSamples,
                custom: this.customSamples
            }[this.get('tab')];
            if (!coll.isFetched) {
                this.set({ isLoading: true });
                return coll.fetch().always(() => this.set({ isLoading: false }));
            }
            return $.Deferred().resolve();

        }

        start() {
            return this.redactor.getPage().startChanges({ onFinishChanges: () => this.onFinishChanges() });
        }

        finish() {
            return this.redactor.finishChanges();
        }

        onFinishChanges() {
            this.clearSelected();
            if (this.get('selectedSample') != null) {
                return this.redactor.sampleUse();
            }
            return this.sampleCancel();

        }

        loadNextCustomPage() {
            return $.ajax({
                type: "GET",
                url: this.customSamples.url + '?limit=' + fetchLimit + '&offset=' + this.customSamples.length,
                contentType: "application/json"
            }).fail(backendValidation(({ error }) => notify.error(i18n.getMessage(error))))
                .then(response => {
                    this.customSamples.push(response.data.layouts);
                    this.customSamples._totalCount = response.data.totalCount;
                    return this.customSamples;
                });
        }
    };
});
function __guard__(value, transform) {
    return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}