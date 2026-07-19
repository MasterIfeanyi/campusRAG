"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Icon from "@/icons/Icon";
import { useTranslate } from "@/hooks/useTranslate";
import { useFlagReview } from "@/hooks/useReviewQueries";
import { showMascotToast } from "@/components/ui/MascotToast";

const REASON_KEYS = [
    "spam",
    "hate_speech",
    "impersonation",
    "false_accusations",
    "harassment",
    "other",
];

export default function ReportModal({ isShown, onClose, reviewId }) {
    const dictionary = useTranslate();
    const t = dictionary.report;
    const { mutate: flagReview, isPending } = useFlagReview();

    const [selectedReason, setSelectedReason] = useState(null);
    const [detail, setDetail] = useState("");

    const isOther = selectedReason === "other";
    const canSubmit = selectedReason && (!isOther || detail.trim().length > 0);

    function resetAndClose() {
        setSelectedReason(null);
        setDetail("");
        onClose();
    }

    function handleSubmit() {
        if (!canSubmit) return;
        flagReview(
            { reviewId, reasonCategory: selectedReason, reasonDetail: detail.trim() },
            {
                onSuccess: () => {
                    showMascotToast(t.success);
                    resetAndClose();
                },
            }
        );
    }

    return (
        <Modal isShown={isShown} onClose={resetAndClose}>
            <div className="flex items-center justify-center min-h-full p-4">
                <div
                    className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
                        <Button
                            type="button"
                            bare
                            onClick={resetAndClose}
                            aria-label={t.cancel}
                            icon={<Icon name="close" size={20} className="text-foreground" />}
                        />
                    </div>

                    <div className="mb-1">
                        {REASON_KEYS.map((key) => (
                            <label
                                key={key}
                                htmlFor={`report-reason-${key}`}
                                className="flex items-center justify-between py-3 cursor-pointer"
                            >
                                <span className="text-base text-foreground">{t.reasons[key]}</span>
                                <input
                                    id={`report-reason-${key}`}
                                    type="radio"
                                    name="report-reason"
                                    value={key}
                                    checked={selectedReason === key}
                                    onChange={() => setSelectedReason(key)}
                                    className="w-5 h-5 accent-[var(--primary)] cursor-pointer"
                                />
                            </label>
                        ))}
                    </div>

                    {selectedReason && (
                        <TextArea
                            id="report-detail"
                            value={detail}
                            onChange={(e) => setDetail(e.target.value)}
                            placeholder={isOther ? t.detailPlaceholderOther : t.detailPlaceholder}
                            rows={3}
                            className="rounded-3xl border-primary/30 focus:border-primary focus:ring-primary/30 px-5 py-4 resize-none h-22 max-w-full"
                        />
                    )}

                    <Button
                        variant="primary"
                        size="large"
                        className="rounded-full mt-2"
                        onClick={handleSubmit}
                        disabled={!canSubmit || isPending}
                        loading={isPending}
                    >
                        {isPending ? t.submitting : t.submit}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}