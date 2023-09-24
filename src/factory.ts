import { Repository } from 'typeorm';

export abstract class Factory<Entity extends object> {
  protected entityCount: number = 1;
  protected extraDefinition: Partial<Entity> = {};

  constructor(protected readonly repository: Repository<Entity>) {}

  count(val: number): typeof this {
    this.entityCount = val;
    return this;
  }

  async create(partialEntity: Partial<Entity> = {}): Promise<Entity[]> {
    return await this.repository.save(this.make(partialEntity));
  }

  async createOne(partialEntity: Partial<Entity> = {}): Promise<Entity> {
    const entities = await this.create(partialEntity);
    return entities[0];
  }

  make(partialEntity: Partial<Entity> = {}): Entity[] {
    const entities: Entity[] = [];

    for (let i = 0; i < this.entityCount; i++) {
      entities.push(this.repository.create({ ...this.definition(), ...this.extraDefinition, ...partialEntity } as Entity));
    }

    return entities;
  }

  makeOne(partialEntity: Partial<Entity> = {}): Entity {
    const entities = this.make(partialEntity);
    return entities[0];
  }

  protected abstract definition(): Partial<Entity>;

  updateDefinition(definition: Partial<Entity>) {
    this.extraDefinition = { ...this.extraDefinition, ...definition };
    return this;
  }
}
