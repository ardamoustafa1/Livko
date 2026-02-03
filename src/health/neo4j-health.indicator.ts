import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { Neo4jService } from '../shared/neo4j/neo4j.service';

@Injectable()
export class Neo4jHealthIndicator extends HealthIndicator {
  constructor(private readonly neo4j: Neo4jService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const driver = this.neo4j.getDriver();
      await driver.verifyConnectivity();
      return this.getStatus(key, true, { connectivity: 'ok' });
    } catch (err) {
      throw new HealthCheckError(
        'Neo4j check failed',
        this.getStatus(key, false, { error: (err as Error).message }),
      );
    }
  }
}
