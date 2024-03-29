+(function (t, s, i) {
  'use strict';
  let e,
    o = function () {
      (this.filterClasses = 'filter-passed filter-failed filter-pending'),
        (this.activeFilters = []),
        (this.chartOpts = {
          percentageInnerCutout: 60,
          segmentShowStroke: !0,
          segmentStrokeWidth: 2,
          animationEasing: 'easeOutQuint',
          showTooltips: !1,
          responsive: !0,
        }),
        (this.chartColors = {
          green: '#5cb85c',
          red: '#d9534f',
          gray: '#999999',
          ltGray: '#CCCCCC',
          ltBlue: '#5bc0de',
        }),
        (this.breakpoints = { sm: 768, md: 992, lg: 1200 }),
        (this.$window = t(window)),
        (this.$body = t('body')),
        (this.$navbar = t('.navbar')),
        (this.$summary = t('.summary')),
        (this.$quickSum = t('.quick-summary')),
        (this.$details = t('.details')),
        (this.$suites = t('.suite')),
        (this.$filterBtns = t('[data-filter]')),
        (this.$suiteCharts = t('.suite-chart')),
        this._setMeasurements(),
        (this.listeningToScroll = this.windowWidth >= this.breakpoints.sm),
        (e = this),
        this.initialize();
    };
  (o.prototype.initialize = function () {
    this.$filterBtns.on('click', e._onFilterClick.bind(e)),
      this.windowWidth > this.breakpoints.sm && this.listenToScroll(!0),
      this.$window.on('resize', i.debounce(e._onWindowResize.bind(e), 200)),
      this.makeSuiteCharts();
  }),
    (o.prototype._setMeasurements = function () {
      (this.windowWidth = this.$window.outerWidth()),
        (this.windowScrollTop = this.$window.scrollTop()),
        (this.quickSummaryScrollOffset =
          this.$summary.outerHeight() - this.$navbar.outerHeight()),
        (this.scrolledPastQuickSummaryOffset =
          this.windowScrollTop > this.quickSummaryScrollOffset);
    }),
    (o.prototype._onFilterClick = function (s) {
      const i = t(s.currentTarget);
      if (!i.hasClass('qs-item') || '0' !== this.$quickSum.css('opacity')) {
        const e = i.data('filter'),
          o = t(`[data-filter=${e}]`),
          r = this.activeFilters.indexOf(e),
          l = -1 !== r;
        l ? this.activeFilters.splice(r, 1) : this.activeFilters.push(e),
          o.toggleClass('active', !l),
          this.updateFilteredTests();
      }
    }),
    (o.prototype._onWindowScroll = function () {
      this._setMeasurements(),
        (this.scrolledPastQuickSummaryOffset &&
          this.$body.hasClass('show-quick-summary')) ||
          this.$body.toggleClass(
            'show-quick-summary',
            this.scrolledPastQuickSummaryOffset,
          );
    }),
    (o.prototype._onWindowResize = function () {
      this._setMeasurements(),
        this.windowWidth < this.breakpoints.sm && this.listeningToScroll
          ? this.listenToScroll(!1)
          : this.windowWidth >= this.breakpoints.sm &&
            !this.listeningToScroll &&
            (this.listenToScroll(!0),
            this.$body.toggleClass(
              'show-quick-summary',
              this.scrolledPastQuickSummaryOffset,
            ));
    }),
    (o.prototype.listenToScroll = function (t) {
      t
        ? this.$window.on('scroll', i.throttle(e._onWindowScroll.bind(e), 200))
        : (this.$window.off('scroll'),
          this.$body.removeClass('show-quick-summary')),
        (this.listeningToScroll = t);
    }),
    (o.prototype._createFilterClasses = function (t) {
      return this.activeFilters.map(s => {
        return t + s;
      });
    }),
    (o.prototype.updateFilteredTests = function () {
      const t = this.activeFilters.length > 0,
        s = this._createFilterClasses('filter-'),
        i = this._createFilterClasses('.');
      if (
        (this.$details
          .removeClass(this.filterClasses)
          .toggleClass('filters-active', t),
        s.length && this.$details.addClass(s.join(' ')),
        this.$suites.toggleClass('hidden', t),
        t)
      )
        for (let e = this.$suites.length - 1; e >= 0; e--) {
          const o = this.$suites.eq(e),
            r = o.find('.test').some(i.join());
          r && o.removeClass('hidden');
        }
    }),
    (o.prototype.makeSuiteCharts = function () {
      this.$suiteCharts.length > 50 && (this.chartOpts.animation = !1);
      for (let t = 0; t < this.$suiteCharts.length; t++) {
        const i = this.$suiteCharts.eq(t),
          e = i[0].getContext('2d'),
          o = i.data(),
          r = [
            {
              value: 10 * o.totalPasses,
              color: this.chartColors.green,
              highlight: this.chartColors.gray,
              label: 'Passed',
            },
            {
              value: 10 * o.totalFailures,
              color: this.chartColors.red,
              highlight: this.chartColors.gray,
              label: 'Failed',
            },
            {
              value: 10 * o.totalPending,
              color: this.chartColors.ltBlue,
              highlight: this.chartColors.gray,
              label: 'Pending',
            },
            {
              value: 10 * o.totalSkipped,
              color: this.chartColors.ltGray,
              highlight: this.chartColors.gray,
              label: 'Skipped',
            },
          ];
        new s(e).Doughnut(r, this.chartOpts);
      }
    }),
    new o();
})(jQuery, Chart, _);
