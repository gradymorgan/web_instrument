var genericScreen = (function() {
    var template = '<div class="label"></div>\
            <div class="value"></div>\
            <!-- small decimal -->\
            <div class="units"></div>';

    return Backbone.View.extend({
        tagName: "div",
        className: "section cf",
        template: template,
        initialize: function(options) {
            this.metric = options.metric;
            this.formatString = options.format;
            this.label = options.label;
            this.units = options.units;

            this.listenTo(this.model, "change", this.update);
            
            this.lastRender = 0;
            this.lastValue = '';
        },
        render: function() {
            this.$el.html(this.template);
            this.$('.label').text(this.label);
            this.$('.units').text(this.units);

            this.update();
        },

        update: function() {
            var now = new Date().getTime();

            if (now - this.lastRender > 200) {
                var displayVal = this.model.get(this.metric);
                
                var newFormattedValue = _.isUndefined(displayVal)? '-':sprintf(this.formatString, displayVal);

                if ( newFormattedValue != this.currentValue ) {
                    this.$('.value').text(newFormattedValue);

                    this.lastRender = now;
                    this.currentValue = newFormattedValue;
                }
            }

            return this;
        }
    });
})();

