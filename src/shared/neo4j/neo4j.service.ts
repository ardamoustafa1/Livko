import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
  private driver: Driver;

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    this.driver = neo4j.driver(
      this.config.get<string>('NEO4J_URI', 'bolt://localhost:7687'),
      neo4j.auth.basic(
        this.config.get<string>('NEO4J_USERNAME', 'neo4j'),
        this.config.get<string>('NEO4J_PASSWORD', ''),
      ),
    );
  }

  async onModuleDestroy(): Promise<void> {
    await this.driver?.close();
  }

  getDriver(): Driver {
    return this.driver;
  }

  getSession(): Session {
    return this.driver.session();
  }

  async runQuery<T = unknown>(query: string, params: Record<string, unknown> = {}): Promise<T[]> {
    const session = this.getSession();
    try {
      const result = await session.run(query, params);
      return result.records.map((r) => r.toObject() as T);
    } finally {
      await session.close();
    }
  }
}
