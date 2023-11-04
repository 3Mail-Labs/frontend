import { Campaign } from "@prisma/client";

import { Card } from "../ui/card";
import { BaseDialogProps, Dialog, DialogContent } from "../ui/dialog";

interface CampaignInfoModalProps extends BaseDialogProps {
  campaign: Campaign;
}

export function CampaignInfoModal({ campaign, ...props }: CampaignInfoModalProps) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <h3 className="text-lg font-semibold">Task ids</h3>
        {campaign.taskIds.map((taskId) => (
          <a
            href={`https://explorer.iex.ec/bellecour/task/${taskId}`}
            target="_blank"
            rel="noreferrer"
            key={taskId}
          >
            <Card className="p-3 hover:underline">
              {taskId.slice(0, 6)}...{taskId.slice(-4)}
            </Card>
          </a>
        ))}
      </DialogContent>
    </Dialog>
  );
}
