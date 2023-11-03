import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { BaseDialogProps, Dialog, DialogContent } from "@/components/ui/dialog";
import { createCampaignSchema } from "@/lib/validations/campaign";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const createCampaignFieldsSchema = createCampaignSchema.pick({
  name: true,
  content: true,
});

type CreateCampaignData = z.infer<typeof createCampaignFieldsSchema>;

export function CreateCampaignModal(props: BaseDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCampaignData>({
    resolver: zodResolver(createCampaignFieldsSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log("Data: ", data);
  });

  return (
    <Dialog {...props} modal={true}>
      <DialogContent>
        <h3 className="text-xl font-bold">Create Campaign</h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name" className="mb-2 block">
              Name
            </Label>
            <Input
              id="name"
              placeholder="My project"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              // disabled={isLoading || isGitHubLoading}
              {...register("name")}
            />
            {errors?.name && <p className="px-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="slug" className="mb-2 block">
              Slug
            </Label>
            <Input
              id="slug"
              placeholder="my-project"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              // disabled={isLoading || isGitHubLoading}
              {...register("content")}
            />
            {errors?.content && (
              <p className="px-1 text-xs text-red-600">{errors.content.message}</p>
            )}
          </div>
          <Button>Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
