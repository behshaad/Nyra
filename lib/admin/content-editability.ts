type LifecycleStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";

export function canEditDraftContent(input: {
  aggregateStatus: LifecycleStatus;
  itemStatus?: LifecycleStatus;
}) {
  return (
    input.aggregateStatus === "DRAFT" &&
    (input.itemStatus === undefined || input.itemStatus === "DRAFT")
  );
}

export const draftRevisionRequiredMessage =
  "Only Draft content can be changed. Published, In Review, and Archived content remain read-only until the Draft Revision workflow is available.";
