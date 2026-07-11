"use client";

import { useRef, useState } from "react";
import type { ElementRef } from "react";
import { Camera, KeyRound, Mail, Save, Trash2, UserRound } from "lucide-react";
import type { InterfaceLanguageCode } from "@/lib/i18n/interface-language";

const labels = {
  fa: {
    avatar: "تصویر پروفایل",
    upload: "بارگذاری",
    replace: "جایگزینی",
    remove: "حذف",
    learner: "پروفایل یادگیرنده",
    displayName: "نام نمایشی",
    sourceLanguage: "زبان مبدا",
    targetLanguage: "زبان هدف",
    currentLevel: "سطح فعلی",
    dailyGoal: "هدف روزانه",
    save: "ذخیره تغییرات",
    account: "تنظیمات حساب",
    email: "ایمیل",
    password: "رمز عبور",
    prepared: "آماده برای اتصال احراز هویت",
    disabledHint: "بعد از فعال شدن Auth، این بخش ایمیل و رمز عبور واقعی را مدیریت می‌کند."
  },
  en: {
    avatar: "Profile picture",
    upload: "Upload",
    replace: "Replace",
    remove: "Remove",
    learner: "Learner Profile",
    displayName: "Display name",
    sourceLanguage: "Source language",
    targetLanguage: "Target language",
    currentLevel: "Current level",
    dailyGoal: "Daily goal",
    save: "Save changes",
    account: "Account Settings",
    email: "Email",
    password: "Password",
    prepared: "Prepared for auth integration",
    disabledHint: "Once Auth is connected, this section will manage real email and password changes."
  },
  de: {
    avatar: "Profilbild",
    upload: "Hochladen",
    replace: "Ersetzen",
    remove: "Entfernen",
    learner: "Lernprofil",
    displayName: "Anzeigename",
    sourceLanguage: "Ausgangssprache",
    targetLanguage: "Zielsprache",
    currentLevel: "Aktuelles Niveau",
    dailyGoal: "Tagesziel",
    save: "Aenderungen speichern",
    account: "Kontoeinstellungen",
    email: "E-Mail",
    password: "Passwort",
    prepared: "Fuer Auth-Integration vorbereitet",
    disabledHint: "Sobald Auth verbunden ist, verwaltet dieser Bereich echte E-Mail- und Passwortaenderungen."
  }
} satisfies Record<InterfaceLanguageCode, Record<string, string>>;

type ProfileValues = {
  displayName: string;
  sourceLanguage: string;
  targetLanguage: string;
  currentLevel: string;
  dailyGoalMinutes: number;
};

export function ProfileSettings({
  language,
  initialValues
}: {
  language: InterfaceLanguageCode;
  initialValues: ProfileValues;
}) {
  const copy = labels[language];
  const inputRef = useRef<ElementRef<"input">>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [values, setValues] = useState(initialValues);

  function update(key: keyof ProfileValues, value: string) {
    setValues((current) => ({
      ...current,
      [key]: key === "dailyGoalMinutes" ? Number(value) : value
    }));
  }

  return (
    <section className="profile-layout">
      <aside className="app-panel avatar-panel">
        <span className="section-label">{copy.avatar}</span>
        <div className="avatar-preview">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" />
          ) : (
            <UserRound size={54} />
          )}
        </div>
        <input
          ref={inputRef}
          accept="image/*"
          className="visually-hidden"
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              setAvatar(globalThis.URL.createObjectURL(file));
            }
          }}
        />
        <div className="route-actions">
          <button className="primary-button" type="button" onClick={() => inputRef.current?.click()}>
            <Camera size={18} />
            {avatar ? copy.replace : copy.upload}
          </button>
          <button
            className="danger-button"
            type="button"
            disabled={!avatar}
            onClick={() => setAvatar(null)}
          >
            <Trash2 size={18} />
            {copy.remove}
          </button>
        </div>
      </aside>

      <section className="app-panel">
        <div className="app-panel-header">
          <div>
            <p className="panel-kicker">{copy.learner}</p>
            <h2>{values.displayName}</h2>
          </div>
          <span className="status-pill">{values.currentLevel}</span>
        </div>

        <div className="form-grid">
          <label>
            <span>{copy.displayName}</span>
            <input value={values.displayName} onChange={(event) => update("displayName", event.target.value)} />
          </label>
          <label>
            <span>{copy.currentLevel}</span>
            <select value={values.currentLevel} onChange={(event) => update("currentLevel", event.target.value)}>
              {["A1", "A2", "B1", "B2"].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{copy.sourceLanguage}</span>
            <input value={values.sourceLanguage} onChange={(event) => update("sourceLanguage", event.target.value)} />
          </label>
          <label>
            <span>{copy.targetLanguage}</span>
            <input value={values.targetLanguage} onChange={(event) => update("targetLanguage", event.target.value)} />
          </label>
          <label className="form-grid-wide">
            <span>{copy.dailyGoal}</span>
            <input
              min={5}
              max={120}
              type="number"
              value={values.dailyGoalMinutes}
              onChange={(event) => update("dailyGoalMinutes", event.target.value)}
            />
          </label>
        </div>

        <div className="route-actions">
          <button className="primary-button" type="button">
            <Save size={18} />
            {copy.save}
          </button>
        </div>
      </section>

      <section className="app-panel account-panel" id="settings">
        <div className="app-panel-header">
          <div>
            <p className="panel-kicker">{copy.prepared}</p>
            <h2>{copy.account}</h2>
          </div>
        </div>
        <div className="account-setting-row">
          <Mail size={18} />
          <div>
            <strong>{copy.email}</strong>
            <span>learner@example.com</span>
          </div>
          <button className="ghost-button compact-link" disabled type="button">
            {copy.prepared}
          </button>
        </div>
        <div className="account-setting-row">
          <KeyRound size={18} />
          <div>
            <strong>{copy.password}</strong>
            <span>{copy.disabledHint}</span>
          </div>
          <button className="ghost-button compact-link" disabled type="button">
            {copy.prepared}
          </button>
        </div>
      </section>
    </section>
  );
}
