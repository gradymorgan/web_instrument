var vmg_template = '';

var vmgDisplay = Backbone.View.extend({
    tagName: "div",
    className: "section cf vmg",
    template: vmg_template,

    initialize: function() {
        this.listenTo(this.model, "change", this.render);
        this.lastRender = 0;
        this.$el.html(this.template);

        this.points = [];
    },

    render: function() {
        var view = this;
        
        var width = this.width = 500;
        var height = this.height = 500;

        var radius = Math.min(width, height) / 2 - 30;

        var angles = d3.range(0, 360, 30);      
        var speeds = d3.range(0, 9, 1)

        var r = this.r = d3.scale.linear()
            .domain([0, 8])
            .range([0, radius]);

        var svg = this.canvas = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


        var gr = this.axis_circles = svg.append("g")
            .attr("class", "r axis")
            .selectAll("g")
            .data(speeds)
            .enter().append("g");

        gr.append("circle")
            .attr("r", r);

        gr.append("text")
            .attr("y", function(d) { return -r(d) - 4; })
            .attr("transform", "rotate(15)")
            .style("text-anchor", "middle")
            .text(function(d) { return d; });


        var ga = this.axis_lines = svg.append("g")
            .attr("class", "a axis")
          .selectAll("g")
            .data(angles)
          .enter().append("g")
            .attr("transform", function(d) { return "rotate(" + -d + ")"; });

        ga.append("line")
            .attr("x2", radius);

        ga.append("text")
            .attr("x", radius + 6)
            .attr("dy", ".35em")
            .style("text-anchor", function(d) { return d < 270 && d > 90 ? "end" : null; })
            .attr("transform", function(d) { return d < 270 && d > 90 ? "rotate(180 " + (radius + 6) + ",0)" : null; })
            .text(function(d) { return -1*((d+90)%360 -180) + "°"; });
        

        function rad(deg) {
            return deg * Math.PI / 180;
        }

        var x = this.x = function(d) {
            return r(d[1]) * Math.cos((d[0]-90) * Math.PI / 180 );
        }

        var y = this.y = function(d) {
            return r(d[1]) * Math.sin((d[0]-90) * Math.PI / 180 );
        }

        console.info('radius', radius, r(6));

        var dots = this.dots = svg.append('g')
            .selectAll('circle.st')
            .data([])
            .enter().append('circle')
                .attr('class', 'st')
                .attr('r', '3')
                .attr('cx', function(d) { return x(d) })
                .attr('cy', function(d) { return y(d) })


        // this.showQuadrant('U-S');
        this.showPerformance([[40, 6]])
        // draw circles for boat speeds, in halfs at most, should be dynamic
        // draw lines for angles
        // draw old points
        // draw latest point

        // 
    },

    showAll: function() {
        this.canvas.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    },
    showQuadrant: function(quadrant) {

        var halfWidth = this.width / 2;
        var halfHeight = this.height / 2;

        var quarterWidth = this.width / 4;
        var quarterHeight = this.height / 4;

        var signX = '', signY = '';
        if ( quadrant == "U-S" ) 
            signX = '-';
        else if ( quadrant == "D-P" ) 
            signY = '-';
        else if ( quadrant == "D-S" )
            signX = signY = '-';

        this.canvas.transition()
            .attr("transform", "translate(" + halfWidth + "," + halfHeight + ")scale(1.9)translate("+ signX + quarterWidth + "," + signY + quarterHeight + ")");
    },

    update: function(dataPoint) {
        if ( !this.workingPoint )
            this.workingPoint = {};

        _.extend(this.workingPoint, _.pick(dataPoint, ["twa","speed"]));

        if ( _.has(this.workingPoint, 'twa') && _.has(this.workingPoint, 'speed') ) {
            this.points.push(this.workingPoint);
            this.workingPoint = {};

            this.showPerformance();
        }
    },

    setSpeeds: function(speeds) {
        this.r.domain(d3.extent(speeds));
        this.axis_circles.data(speeds);
    },

    drawPerformance: function() {
        this.dots 
            .data(points);
    },

    drawInstrument: function() {

    }
});