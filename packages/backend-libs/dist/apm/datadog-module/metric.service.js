"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricService = void 0;
/* eslint-disable no-process-env */
const common_1 = require("@nestjs/common");
const hot_shots_1 = require("hot-shots");
let MetricService = class MetricService {
    constructor() {
        this.dogstatsd = new hot_shots_1.StatsD({});
    }
    async count(event, count, tags = {}) {
        const statsd = this.dogstatsd;
        return new Promise((r) => {
            statsd.distribution(['tymlez', event].join('.'), count, {
                env: process.env.NODE_ENV || 'dev',
                service: process.env.DD_SERVICE || 'tymlez',
                client_name: process.env.CLIENT_NAME || 'tymlez',
                ...tags,
            }, r);
        });
    }
};
MetricService = __decorate([
    (0, common_1.Injectable)()
], MetricService);
exports.MetricService = MetricService;
//# sourceMappingURL=metric.service.js.map