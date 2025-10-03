import { Button } from "@mantine/core";
import { Plus } from "lucide-react";
import { Link } from "react-router";

export default function EditorIndexPage() {
  return (
    <div className="brand-container">
      <title>Editor Page</title>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="display-text-1">Content Overview </h1>
          <p className="text-sm text-light-text">
            Manage platform blog content
          </p>
        </div>

        <div>
          <Button variant="filled" component={Link} to={`/editor/new`}>
            <div className="flex items-center ">
              {" "}
              <Plus size={16} className="mr-2" /> Add new content
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
