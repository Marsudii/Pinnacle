import { Check, ChevronLeft, ChevronRight, Database, Loader2, Plug, X } from 'lucide-react'
import { useState } from 'react'
import { testConnection } from '../../../services/tauriClient'
import type { ConnectionProfile, ConnectionType } from '../../../types/domain'
import type { WizardStep, TestConnectionResult } from '../types'
import { databaseTypeOptions, defaultPortByType, defaultInitialDatabaseByType } from '../constants'
import { isSqlConnectionType } from '../utils'

interface ConnectionWizardModalProps {
  editingId: string | null
  existingProfile: ConnectionProfile | null
  onSave: (profile: ConnectionProfile) => void
  onClose: () => void
}

export function ConnectionWizardModal({
  editingId,
  existingProfile,
  onSave,
  onClose,
}: ConnectionWizardModalProps) {
  const [step, setStep] = useState<WizardStep>(1)
  const [newType, setNewType] = useState<ConnectionType>(existingProfile?.type ?? 'postgresql')
  const [newName, setNewName] = useState(existingProfile?.name ?? '')
  const [newHost, setNewHost] = useState(existingProfile?.host ?? 'localhost')
  const [newPort, setNewPort] = useState(String(existingProfile?.port ?? defaultPortByType.postgresql))
  const [newInitialDatabase, setNewInitialDatabase] = useState(
    existingProfile?.database ?? defaultInitialDatabaseByType.postgresql,
  )
  const [newUser, setNewUser] = useState(existingProfile?.username ?? '')
  const [newPassword, setNewPassword] = useState(existingProfile?.password ?? '')
  const [newSsl, setNewSsl] = useState(existingProfile?.ssl ?? false)
  const [newTags, setNewTags] = useState(existingProfile?.tags.join(', ') ?? 'Development')
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [testConnectionResult, setTestConnectionResult] = useState<TestConnectionResult | null>(null)

  const resetForm = () => {
    setStep(1)
    setNewType('postgresql')
    setNewName('')
    setNewHost('localhost')
    setNewPort(String(defaultPortByType.postgresql))
    setNewInitialDatabase(defaultInitialDatabaseByType.postgresql)
    setNewUser('')
    setNewPassword('')
    setNewSsl(false)
    setNewTags('Development')
    setIsTestingConnection(false)
    setTestConnectionResult(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleChangeType = (type: ConnectionType) => {
    setNewType(type)
    setNewPort(String(defaultPortByType[type]))
    setNewInitialDatabase(defaultInitialDatabaseByType[type])
    setTestConnectionResult(null)
  }

  const handleTestConnection = async () => {
    if (!newHost.trim() || !newPort.trim() || !newInitialDatabase.trim()) {
      setTestConnectionResult({
        kind: 'error',
        message: 'Please complete host, port, and database before testing.',
      })
      return
    }

    if (!isSqlConnectionType(newType)) {
      setTestConnectionResult({
        kind: 'success',
        message: 'Connector validated locally. Deep test is enabled for PostgreSQL/MySQL in this MVP.',
      })
      return
    }

    const parsedPort = Number(newPort)
    setIsTestingConnection(true)
    setTestConnectionResult(null)

    try {
      const result = await testConnection({
        type: newType,
        host: newHost.trim(),
        port: Number.isFinite(parsedPort) ? parsedPort : defaultPortByType[newType],
        username: newUser.trim(),
        password: newPassword,
        database: newInitialDatabase.trim() || defaultInitialDatabaseByType[newType],
        ssl: newSsl,
      })

      setTestConnectionResult({
        kind: result.ok ? 'success' : 'error',
        message: result.message,
      })
    } catch (error) {
      setTestConnectionResult({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Failed to test connection.',
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const handleSave = () => {
    if (!newName.trim() || !newHost.trim() || !newPort.trim() || !newInitialDatabase.trim()) {
      return
    }

    const now = new Date().toISOString()
    const parsedPort = Number(newPort)
    const savedId = editingId ?? crypto.randomUUID()
    const tags = newTags
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    onSave({
      id: savedId,
      name: newName.trim(),
      type: newType,
      host: newHost.trim(),
      port: Number.isFinite(parsedPort) ? parsedPort : defaultPortByType[newType],
      username: newUser.trim(),
      password: newPassword,
      database: newInitialDatabase.trim() || defaultInitialDatabaseByType[newType],
      ssl: newSsl,
      encryptedPasswordRef:
        newPassword.length > 0
          ? 'stronghold://pending'
          : (existingProfile?.encryptedPasswordRef ?? 'stronghold://empty'),
      tags: tags.length > 0 ? tags : ['Ungrouped'],
      favorite: existingProfile?.favorite ?? false,
      createdAt: existingProfile?.createdAt ?? now,
      updatedAt: now,
    })

    handleClose()
  }

  const selectedOption = databaseTypeOptions.find((o) => o.value === newType)

  const inputClasses =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <section className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <Database size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {editingId ? 'Edit Connection' : 'New Connection'}
              </h3>
              <p className="text-xs text-slate-400">
                Step {step} of 2
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </header>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 px-6 pt-4">
          <div className={`flex items-center gap-1.5 text-xs font-medium ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              1
            </span>
            Database Type
          </div>
          <div className={`h-px flex-1 ${step >= 2 ? 'bg-blue-300' : 'bg-slate-200'}`} />
          <div className={`flex items-center gap-1.5 text-xs font-medium ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              2
            </span>
            Connection Details
          </div>
        </div>

        {/* Step 1: Select Database Type */}
        {step === 1 && (
          <div className="px-6 py-5">
            <p className="mb-4 text-sm text-slate-500">Choose the database you want to connect to.</p>
            <div className="grid grid-cols-2 gap-2.5">
              {databaseTypeOptions.map((option) => {
                const active = option.value === newType
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChangeType(option.value)}
                    className={[
                      'group flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all',
                      active
                        ? 'border-blue-300 bg-blue-50/80 shadow-sm ring-1 ring-blue-200'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition ${
                        active ? 'bg-white shadow-sm' : 'bg-slate-50 group-hover:bg-white'
                      }`}
                    >
                      <img src={option.logoSrc} alt={option.label} className="h-5 w-5 object-contain" />
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-sm font-semibold ${active ? 'text-blue-700' : 'text-slate-700'}`}>
                        {option.label}
                      </span>
                      <span className="block text-[11px] text-slate-400">{option.hint}</span>
                    </span>
                    {active && (
                      <span className="ml-auto grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-600">
                        <Check size={12} className="text-white" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2: Connection Details + Test */}
        {step === 2 && (
          <div className="px-6 py-5">
            {/* Selected type badge */}
            <div className="mb-4 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-slate-100">
                <img src={selectedOption?.logoSrc} alt={selectedOption?.label} className="h-4 w-4 object-contain" />
              </span>
              <span className="text-sm font-medium text-slate-700">{selectedOption?.label}</span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="ml-auto text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Change
              </button>
            </div>

            <div className="space-y-3">
              {/* Name */}
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Connection name"
                className={inputClasses}
              />

              {/* Host & Port */}
              <div className="flex gap-2">
                <input
                  value={newHost}
                  onChange={(e) => setNewHost(e.target.value)}
                  placeholder="Host"
                  className={`${inputClasses} w-2/3`}
                />
                <input
                  value={newPort}
                  onChange={(e) => setNewPort(e.target.value)}
                  placeholder="Port"
                  className={`${inputClasses} w-1/3`}
                />
              </div>

              {/* Database */}
              <input
                value={newInitialDatabase}
                onChange={(e) => setNewInitialDatabase(e.target.value)}
                placeholder="Database"
                className={inputClasses}
              />

              {/* Username & Password */}
              <div className="flex gap-2">
                <input
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                  placeholder="Username"
                  className={`${inputClasses} flex-1`}
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Password"
                  className={`${inputClasses} flex-1`}
                />
              </div>

              {/* Tags & SSL */}
              <div className="flex items-center gap-3">
                <input
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Group"
                  className={`${inputClasses} flex-1`}
                />
                <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm text-slate-600">
                  <span
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      newSsl ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={newSsl}
                      onChange={(e) => setNewSsl(e.target.checked)}
                      className="sr-only"
                    />
                    <span
                      className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
                        newSsl ? 'translate-x-[18px]' : 'translate-x-1'
                      }`}
                    />
                  </span>
                  SSL
                </label>
              </div>

              {/* Test Connection */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isTestingConnection ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Testing connection…
                    </>
                  ) : (
                    <>
                      <Plug size={15} />
                      Test Connection
                    </>
                  )}
                </button>

                {testConnectionResult && (
                  <div
                    className={`mt-2 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${
                      testConnectionResult.kind === 'success'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                  >
                    {testConnectionResult.kind === 'success' ? (
                      <Check size={14} className="mt-0.5 shrink-0" />
                    ) : (
                      <X size={14} className="mt-0.5 shrink-0" />
                    )}
                    <span>{testConnectionResult.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            disabled={step === 1}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:invisible"
          >
            <ChevronLeft size={15} />
            Back
          </button>

          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800"
            >
              Continue
              <ChevronRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={!newName.trim() || !newHost.trim() || !newPort.trim() || !newInitialDatabase.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={15} />
              {editingId ? 'Update Connection' : 'Save Connection'}
            </button>
          )}
        </footer>
      </section>
    </div>
  )
}