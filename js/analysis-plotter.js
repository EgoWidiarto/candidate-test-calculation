"use strict";

/**
 * Plot result dari beam analysis menggunakan Canvas API
 */
class AnalysisPlotter {
  constructor(containerId, yAxisLabel) {
    this.canvas = document.getElementById(containerId);
    this.ctx = this.canvas.getContext("2d");
    this.yAxisLabel = yAxisLabel;
    this.width = this.canvas.width || 600;
    this.height = this.canvas.height || 300;
  }

  /**
   * Plot equation data
   * @param {Object} data - {beam, load, equation}
   */
  plot(data) {
    if (!data || !data.equation || !data.beam) {
      console.error("Invalid data for plotting");
      return;
    }

    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Hitung total panjang beam
    const L1 = data.beam.primarySpan;
    const L2 = data.beam.secondarySpan || 0;
    const totalLength = L1 + L2;

    // Generate data points
    const points = this.generatePoints(data.equation, totalLength);

    // Hitung scale
    const scale = this.calculateScale(points);

    // Draw grid
    this.drawGrid(scale);

    // Draw axes
    this.drawAxes(scale, totalLength);

    // Draw curve
    this.drawCurve(points, scale, totalLength);

    // Draw labels
    this.drawLabels(scale, totalLength);
  }

  /**
   * Generate points dari equation
   */
  generatePoints(equation, totalLength) {
    const points = [];
    const step = totalLength / 150; // 150 points untuk smooth curve

    for (let x = 0; x <= totalLength; x += step) {
      const point = equation(x);
      points.push(point);
    }

    // Tambah point terakhir
    const lastPoint = equation(totalLength);
    points.push(lastPoint);

    return points;
  }

  /**
   * Calculate scale untuk chart
   */
  calculateScale(points) {
    let minY = points[0]?.y || 0;
    let maxY = points[0]?.y || 0;

    points.forEach((p) => {
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });

    // Add padding 15%
    const range = Math.abs(maxY - minY);
    const padding = range === 0 ? 1 : range * 0.15;

    return {
      minY: minY - padding,
      maxY: maxY + padding,
      rangeY: maxY + padding - (minY - padding),
    };
  }

  /**
   * Draw grid lines
   */
  drawGrid(scale) {
    const padding = 60;
    const width = this.width - 2 * padding;
    const height = this.height - 2 * padding;

    this.ctx.strokeStyle = "#e0e0e0";
    this.ctx.lineWidth = 0.5;

    // Horizontal grid lines
    const horizontalLines = 5;
    for (let i = 0; i <= horizontalLines; i++) {
      const y = padding + (height / horizontalLines) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(padding, y);
      this.ctx.lineTo(this.width - padding, y);
      this.ctx.stroke();
    }

    // Vertical grid lines
    const verticalLines = 8;
    for (let i = 0; i <= verticalLines; i++) {
      const x = padding + (width / verticalLines) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(x, padding);
      this.ctx.lineTo(x, this.height - padding);
      this.ctx.stroke();
    }
  }

  /**
   * Draw axes
   */
  drawAxes(scale, totalLength) {
    const padding = 60;
    const width = this.width - 2 * padding;
    const height = this.height - 2 * padding;

    this.ctx.strokeStyle = "#000";
    this.ctx.lineWidth = 2;

    // X-axis
    this.ctx.beginPath();
    this.ctx.moveTo(padding, this.height - padding);
    this.ctx.lineTo(this.width - padding, this.height - padding);
    this.ctx.stroke();

    // Y-axis
    this.ctx.beginPath();
    this.ctx.moveTo(padding, padding);
    this.ctx.lineTo(padding, this.height - padding);
    this.ctx.stroke();

    // Arrow for X-axis
    this.drawArrow(this.width - padding - 5, this.height - padding, 10, 0);

    // Arrow for Y-axis
    this.drawArrow(padding, padding + 5, 0, -10);
  }

  /**
   * Draw arrow untuk axes
   */
  drawArrow(x, y, dx, dy) {
    const size = 8;
    const angle = Math.atan2(dy, dx);

    this.ctx.fillStyle = "#000";
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x - size * Math.cos(angle - Math.PI / 6), y - size * Math.sin(angle - Math.PI / 6));
    this.ctx.lineTo(x - size * Math.cos(angle + Math.PI / 6), y - size * Math.sin(angle + Math.PI / 6));
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * Draw curve
   */
  drawCurve(points, scale, totalLength) {
    const padding = 60;
    const width = this.width - 2 * padding;
    const height = this.height - 2 * padding;

    this.ctx.strokeStyle = "#248da7";
    this.ctx.lineWidth = 2.5;
    this.ctx.beginPath();

    let isFirst = true;
    points.forEach((p) => {
      const xPixel = padding + (p.x / totalLength) * width;
      const yPixel = this.height - padding - ((p.y - scale.minY) / scale.rangeY) * height;

      if (isFirst) {
        this.ctx.moveTo(xPixel, yPixel);
        isFirst = false;
      } else {
        this.ctx.lineTo(xPixel, yPixel);
      }
    });

    this.ctx.stroke();
  }

  /**
   * Draw labels untuk axes
   */
  drawLabels(scale, totalLength) {
    const padding = 60;
    const width = this.width - 2 * padding;
    const height = this.height - 2 * padding;

    this.ctx.fillStyle = "#000";
    this.ctx.font = "11px Arial";
    this.ctx.textAlign = "center";

    // X-axis labels
    const xLabels = 5;
    for (let i = 0; i <= xLabels; i++) {
      const x = padding + (width / xLabels) * i;
      const value = (totalLength / xLabels) * i;
      this.ctx.fillText(value.toFixed(1), x, this.height - padding + 20);
    }

    // Y-axis labels
    this.ctx.textAlign = "right";
    this.ctx.textBaseline = "middle";
    const yLabels = 5;
    for (let i = 0; i <= yLabels; i++) {
      const y = this.height - padding - (height / yLabels) * i;
      const value = scale.minY + (scale.rangeY / yLabels) * i;
      const displayValue = isFinite(value) ? value.toFixed(3) : "0";
      this.ctx.fillText(displayValue, padding - 10, y);
    }

    // Axis titles
    this.ctx.font = "bold 12px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("Distance (m)", this.width / 2, this.height - 10);

    this.ctx.save();
    this.ctx.translate(15, this.height / 2);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.textAlign = "center";
    this.ctx.fillText(this.yAxisLabel, 0, 0);
    this.ctx.restore();
  }
}
