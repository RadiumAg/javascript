interface ConditionParams {
  target_mood?: string;
  threshold?: number;
  character?: string;
  [key: string]: unknown;
}

interface Context {
  mood?: string;
  time?: number;
  active_characters?: string[];
  [key: string]: unknown;
}

type ConditionType = 'mood_match' | 'time_elapsed' | 'character_present';

class Condition {
  private type: ConditionType;
  private params: ConditionParams;
  private action: string;

  constructor(type: ConditionType, params: ConditionParams, action: string) {
    this.type = type;
    this.params = params;
    this.action = action;
  }

  evaluate(context: Context): boolean {
    switch (this.type) {
      case 'mood_match':
        return context.mood === this.params.target_mood;
      case 'time_elapsed':
        return (context.time ?? 0) >= (this.params.threshold ?? 0);
      case 'character_present':
        return (context.active_characters ?? []).includes(
          this.params.character!,
        );
      default:
        return false;
    }
  }

  getAction(): string {
    return this.action;
  }
}

interface ConditionConfig {
  type: ConditionType;
  params: ConditionParams;
  action: string;
}

class TriggerRule {
  private conditions: Condition[];

  constructor(conditions: ConditionConfig[]) {
    this.conditions = conditions.map(
      (c) => new Condition(c.type, c.params, c.action),
    );
  }

  evaluate(context: Context): boolean {
    return this.conditions.some((condition) => condition.evaluate(context));
  }

  getTriggeredActions(context: Context): string[] {
    return this.conditions
      .filter((condition) => condition.evaluate(context))
      .map((condition) => condition.getAction());
  }
}

export { TriggerRule, Condition };
export type { ConditionParams, Context, ConditionType, ConditionConfig };
