"use strict";

/** ============================ Beam Analysis Data Type ============================ */

/**
 * Beam material specification.
 *
 * @param {String} name         Material name
 * @param {Object} properties   Material properties {EI : 0, GA : 0, ....}
 */
class Material {
  constructor(name, properties) {
    this.name = name;
    this.properties = properties;
  }
}

/**
 *
 * @param {Number} primarySpan          Beam primary span length
 * @param {Number} secondarySpan        Beam secondary span length
 * @param {Material} material           Beam material object
 */
class Beam {
  constructor(primarySpan, secondarySpan, material) {
    this.primarySpan = primarySpan;
    this.secondarySpan = secondarySpan;
    this.material = material;
  }
}

/** ============================ Beam Analysis Class ============================ */

class BeamAnalysis {
  constructor() {
    this.options = {
      condition: "simply-supported",
    };

    this.analyzer = {
      "simply-supported": new BeamAnalysis.analyzer.simplySupported(),
      "two-span-unequal": new BeamAnalysis.analyzer.twoSpanUnequal(),
    };
  }
  /**
   *
   * @param {Beam} beam
   * @param {Number} load
   */
  getDeflection(beam, load, condition) {
    var analyzer = this.analyzer[condition];

    if (analyzer) {
      return {
        beam: beam,
        load: load,
        equation: analyzer.getDeflectionEquation(beam, load),
      };
    } else {
      throw new Error("Invalid condition");
    }
  }
  getBendingMoment(beam, load, condition) {
    var analyzer = this.analyzer[condition];

    if (analyzer) {
      return {
        beam: beam,
        load: load,
        equation: analyzer.getBendingMomentEquation(beam, load),
      };
    } else {
      throw new Error("Invalid condition");
    }
  }
  getShearForce(beam, load, condition) {
    var analyzer = this.analyzer[condition];

    if (analyzer) {
      return {
        beam: beam,
        load: load,
        equation: analyzer.getShearForceEquation(beam, load),
      };
    } else {
      throw new Error("Invalid condition");
    }
  }
}

/** ============================ Beam Analysis Analyzer ============================ */

/**
 * Available analyzers for different conditions
 */
BeamAnalysis.analyzer = {};

/**
 * Calculate deflection, bending stress and shear stress for a simply supported beam
 *
 * @param {Beam}   beam   The beam object
 * @param {Number}  load    The applied load
 */
BeamAnalysis.analyzer.simplySupported = class {
  constructor(beam, load) {
    this.beam = beam;
    this.load = load;
  }
  getDeflectionEquation(beam, load) {
    const L = beam.primarySpan * 1000; // Convert m to mm
    const w = load; // kN/m = N/mm
    const EI = beam.material.properties.EI; // Nmm²

    return function (x) {
      const xMm = x * 1000; // Convert m to mm

      if (xMm < 0 || xMm > L) {
        return { x: x, y: 0 };
      }

      const numerator = -w * (L * Math.pow(xMm, 3) - 2 * Math.pow(L, 2) * xMm * xMm + Math.pow(L, 3) * xMm);
      const yMm = numerator / (24 * EI);

      return {
        x: x,
        y: yMm, // in mm
      };
    };
  }
  getBendingMomentEquation(beam, load) {
    const L = beam.primarySpan;
    const w = load;

    return function (x) {
      if (x < 0 || x > L) {
        return { x: x, y: 0 };
      }

      const M = (w / 2) * x * (L - x);

      return {
        x: x,
        y: M,
      };
    };
  }
  getShearForceEquation(beam, load) {
    const L = beam.primarySpan;
    const w = load;

    return function (x) {
      if (x < 0 || x > L) {
        return { x: x, y: 0 };
      }

      const V = w * (L / 2 - x);

      return {
        x: x,
        y: V,
      };
    };
  }
};

/**
 * Calculate deflection, bending stress and shear stress for a beam with two spans of equal condition
 *
 * @param {Beam}   beam   The beam object
 * @param {Number}  load    The applied load
 */
BeamAnalysis.analyzer.twoSpanUnequal = class {
  constructor(beam, load) {
    this.beam = beam;
    this.load = load;
  }

  // Support function to calculate moment
  calculateMiddleMoment(beam, load) {
    const L1 = beam.primarySpan;
    const L2 = beam.secondarySpan;
    const w = load;

    const M = (-(w / 12) * (Math.pow(L1, 3) + Math.pow(L2, 3))) / (L1 + L2);

    return M;
  }

  getDeflectionEquation(beam, load) {
    const L1 = beam.primarySpan * 1000; // Convert m to mm
    const L2 = beam.secondarySpan * 1000; // Convert m to mm
    const w = load; // kN/m = N/mm
    const EI = beam.material.properties.EI; // Nmm²
    const Mb = this.calculateMiddleMoment(beam, load);

    return function (x) {
      const xMm = x * 1000; // Convert m to mm
      let y;

      // Span 1 (0 <= x <= L1)
      if (xMm >= 0 && xMm <= L1) {
        const term1 = -(w / 24) * xMm * (L1 * L1 * L1 - 2 * L1 * xMm * xMm + xMm * xMm * xMm);
        const term2 = -(Mb / 6) * xMm * (L1 * L1 - xMm * xMm);
        y = (term1 + term2) / EI;
      }
      // Span 2 (L1 < x <= L1+L2)
      else if (xMm > L1 && xMm <= L1 + L2) {
        const xPrime = xMm - L1;
        const term1 = -(w / 24) * xPrime * (L2 * L2 * L2 - 2 * L2 * xPrime * xPrime + xPrime * xPrime * xPrime);
        const term2 = -(Mb / 6) * xPrime * (L2 * L2 - xPrime * xPrime);
        y = (term1 + term2) / EI;
      } else {
        y = 0;
      }

      return {
        x: x,
        y: y, // in mm
      };
    };
  }
  getBendingMomentEquation(beam, load) {
    const L1 = beam.primarySpan;
    const L2 = beam.secondarySpan;
    const w = load;
    const Mb = this.calculateMiddleMoment(beam, load);

    return function (x) {
      let M;

      // Span 1
      if (x >= 0 && x <= L1) {
        const Va = (w * L1) / 2 + Mb / L1;
        M = Va * x - (w / 2) * x * x - Mb;
      }
      // Span 2
      else if (x > L1 && x <= L1 + L2) {
        const Vc = (w * L2) / 2 - Mb / L2;
        const xPrime = x - L1;
        M = -Vc * (L2 - xPrime) + (w / 2) * xPrime * xPrime;
      } else {
        M = 0;
      }

      return {
        x: x,
        y: M,
      };
    };
  }

  getShearForceEquation(beam, load) {
    const L1 = beam.primarySpan;
    const L2 = beam.secondarySpan;
    const w = load;
    const Mb = this.calculateMiddleMoment(beam, load);

    return function (x) {
      let V;

      // Span 1
      if (x >= 0 && x <= L1) {
        const Va = (w * L1) / 2 + Mb / L1;
        V = Va - w * x;
      }
      // Span 2
      else if (x > L1 && x <= L1 + L2) {
        const Vc = (w * L2) / 2 - Mb / L2;
        V = -Vc + w * (x - L1);
      } else {
        V = 0;
      }

      return {
        x: x,
        y: V,
      };
    };
  }
};
