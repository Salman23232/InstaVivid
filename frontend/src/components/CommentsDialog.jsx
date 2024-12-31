import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";

const CommentsDialog = ({ open, setopen }) => {
    const [text, settext] = useState('')
    const onchangeHandler = (e) =>{
        const inputText = e.target.value
        if (inputText.trim()) {
          settext(inputText)
        }else(
          settext('')
        )
      }
const sendMessageHandler = () =>{
alert('message sent')
}
  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogContent
        className="max-w-5xl p-0 flex flex-col"
        onInteractOutside={() => setopen(false)}
      >
        <section className="flex flex-1">
          <div className="w-1/2">
            <img
              src="https://images.unsplash.com/photo-1733919504961-2d6314e90089?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D"
              alt="Sample Image"
              className="rounded-md aspect-square w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="p-10 flex items-center justify-between">
              <div className="flex gap-5 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                      className="w-10 h-10 rounded-full"
                    />
                    <AvatarFallback className="w-8 h-8 rounded-full bg-gray-200 text-sm">
                      Cn
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="text-sm font-semibold">Username</Link>
                </div>
              </div>
              <Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer" />
                  </DialogTrigger>

                  {/* Dialog Content with Post Actions */}
                  <DialogContent className="flex flex-col items-center space-y-2 text-sm text-center p-4">
                    <Button
                      variant="ghost"
                      className="cursor-pointer w-full text-red-600 font-bold"
                    >
                      Unfollow
                    </Button>
                    <Button
                      variant="ghost"
                      className="cursor-pointer w-full font-bold"
                    >
                      Add to Favorites
                    </Button>
                  </DialogContent>
                </Dialog>
              </Dialog>
            </div>
              <hr />
              <div className="flex-1 overflow-y-auto p-4 max-w-96">commentsssfaefdaea</div>

          <div className="p-3 flex gap-3">
            <input value={text} onChange={onchangeHandler} className=" w-full outline-none border border-gray-200 rounded-md p-2" type="text" placeholder="Add a comment ..." />
            <Button disabled={!text.trim()} variant='outline' onclick={sendMessageHandler}>Send</Button>
          </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsDialog;
