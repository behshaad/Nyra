import { describe, expect, it } from "vitest";
import { PublicationStatus, ResourceType } from "@/lib/generated/prisma/enums";
import { localizeResourceForInterface } from "@/lib/resources/resource-display";

const persianTextPattern = /[\u0600-\u06FF]/;

describe("resource display localization", () => {
  it("removes Persian resource text in English interface mode", () => {
    const resource = localizeResourceForInterface(
      {
        id: "resource-1",
        slug: "family-vocabulary-audio",
        title: "درس صوتی واژگان خانواده",
        description: "واژه‌های خانواده با تکرار شنیداری، مکث و مثال‌های ساده.",
        type: ResourceType.AUDIO_LESSON,
        levelLabel: "A1",
        language: "fa/de",
        thumbnailIcon: "headphones",
        metadata: {
          focus: "واژگان خانواده",
          format: "Audio drill"
        },
        content:
          "این درس صوتی برای مرور der Bruder، die Schwester، meine Familie و جمله‌های معرفی خانواده طراحی شده است.",
        url: null,
        publicationStatus: PublicationStatus.PUBLISHED,
        unitId: "unit-1",
        skillId: "skill-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        unit: {
          id: "unit-1",
          levelId: "level-1",
          order: 2,
          slug: "a1-people-and-family",
          title: "آدم‌ها و خانواده",
          summary: "درباره حال، خداحافظی، اعضای خانواده، دوستان و سن صحبت کنید.",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        skill: {
          id: "skill-1",
          unitId: "unit-1",
          order: 3,
          slug: "introduce-family",
          title: "خانواده را معرفی کن",
          description: "اعضای خانواده را نام ببر.",
          kind: "REGULAR",
          xp: 80,
          passingScore: null,
          requeueIncorrect: true,
          publicationStatus: PublicationStatus.PUBLISHED,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      "en"
    );

    expect(resource.title).toBe("A1: People and family");
    expect(resource.description).not.toMatch(persianTextPattern);
    expect(resource.content).not.toMatch(persianTextPattern);
    expect(resource.unit?.title).toBe("People and family");
    expect(resource.skill?.title).toBe("Introduce family");
    expect(String((resource.metadata as Record<string, unknown>).focus)).not.toMatch(
      persianTextPattern
    );
  });
});

