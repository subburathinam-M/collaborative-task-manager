import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const columns = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" }
];

export default function TaskBoard({
  tasks,
  onStatusChange,
  onDelete,
  currentUser
}) {
  const grouped = columns.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id);
    return acc;
  }, {});

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;
    onStatusChange(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid sm:grid-cols-3 gap-4">
        {columns.map((col) => (
          <Droppable droppableId={col.id} key={col.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 min-h-[200px]"
              >
                <h3 className="text-sm font-semibold mb-2">
                  {col.title}
                </h3>
                <div className="space-y-2">
                  {grouped[col.id]?.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-xs flex justify-between items-start"
                        >
                          <div>
                            <p className="font-medium text-sm">
                              {task.title}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {task.description}
                            </p>
                            <p className="text-[10px] mt-1 text-gray-400">
                              Priority: {task.priority}
                            </p>
                          </div>
                          {(currentUser.role === "manager" ||
                            task.assignedTo?._id === currentUser._id) && (
                            <button
                              onClick={() => onDelete(task._id)}
                              className="text-[10px] text-red-500"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
