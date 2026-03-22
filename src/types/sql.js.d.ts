declare module "sql.js" {
  interface SqlJsStatic {
    Database: new (data?: ArrayLike<number> | Buffer | null) => Database;
  }

  interface Database {
    run(sql: string, params?: Record<string, unknown>): Database;
    exec(sql: string, params?: Record<string, unknown>): QueryExecResult[];
    prepare(sql: string): Statement;
    close(): void;
  }

  interface Statement {
    bind(params?: Record<string, unknown>): boolean;
    step(): boolean;
    getAsObject(params?: Record<string, unknown>): Record<string, unknown>;
    free(): boolean;
    reset(): void;
  }

  interface QueryExecResult {
    columns: string[];
    values: unknown[][];
  }

  export default function initSqlJs(config?: Record<string, unknown>): Promise<SqlJsStatic>;
  export type { Database, Statement, SqlJsStatic, QueryExecResult };
}
