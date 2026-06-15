use crate::{
    domain::query::{
        ConnectionTestResult, DdlExecutionResult, DdlPlan, QueryResult, SqlQueryPayload,
        TableSchemaInfo,
    },
    infrastructure::connectors::{ddl, sql},
};

#[tauri::command]
pub async fn test_connection(
    payload: crate::domain::query::ConnectionPayload,
) -> Result<ConnectionTestResult, String> {
    sql::test_connection(&payload)
        .await
        .map(|_| ConnectionTestResult {
            ok: true,
            message: "Connection successful".to_string(),
        })
        .map_err(|err| err.to_string())
}

#[tauri::command]
pub async fn execute_sql(payload: SqlQueryPayload) -> Result<QueryResult, String> {
    sql::execute_sql(&payload.connection, payload.sql.as_str())
        .await
        .map_err(|err| err.to_string())
}

#[tauri::command]
pub async fn sql_get_table_schema(
    payload: crate::domain::query::ConnectionPayload,
    table_name: String,
) -> Result<TableSchemaInfo, String> {
    sql::get_table_schema(&payload, &table_name)
        .await
        .map_err(|err| err.to_string())
}

#[tauri::command]
pub async fn sql_generate_ddl(
    payload: crate::domain::query::ConnectionPayload,
    current: Option<TableSchemaInfo>,
    pending: TableSchemaInfo,
) -> Result<DdlPlan, String> {
    ddl::generate_ddl(&payload.r#type, current.as_ref(), &pending).map_err(|err| err.to_string())
}

#[tauri::command]
pub async fn sql_execute_ddl(
    payload: crate::domain::query::ConnectionPayload,
    plan: DdlPlan,
) -> Result<DdlExecutionResult, String> {
    sql::execute_ddl_statements(&payload, &plan)
        .await
        .map_err(|err| err.to_string())
}
