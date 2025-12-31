import { useState, useRef, MouseEvent as ReactMouseEvent, useEffect } from 'react';
import { Plot, Project } from '@/types';
import { STATUS_COLORS } from '@/lib/plotUtils';
import { useApp } from '@/context/AppContext';
import PlotTooltip from './PlotTooltip';
import PlotModal from './PlotModal';
import { Lock, Unlock, Move, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';

interface PlotOverlayEditorProps {
  layoutImage: string;
  plots: Plot[];
  projectId: string;
  project: Project;
  editMode: boolean;
}

type DragMode = 'none' | 'move' | 'resize';

export default function PlotOverlayEditor({
  layoutImage,
  plots,
  projectId,
  project,
  editMode,
}: PlotOverlayEditorProps) {
  const { isAdmin, updatePlot, deletePlot } = useApp();

  const [hoveredPlot, setHoveredPlot] = useState<Plot | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [dragMode, setDragMode] = useState<DragMode>('none');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialBounds, setInitialBounds] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: ReactMouseEvent, plot: Plot) => {
    if (dragMode !== 'none') return;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setHoveredPlot(plot);
  };

  const handlePlotClick = (plot: Plot, e: ReactMouseEvent) => {
    if (dragMode !== 'none') return;

    if (editMode && isAdmin && !plot.isLocked) {
      setEditingPlot(plot);
    } else {
      setSelectedPlot(plot);
    }
  };

  const handleUpdatePlot = (updates: Partial<Plot>) => {
    if (!selectedPlot) return;
    updatePlot(projectId, selectedPlot.id, updates);
    setSelectedPlot({ ...selectedPlot, ...updates });
  };

  const handleDeletePlot = () => {
    if (!selectedPlot) return;
    deletePlot(projectId, selectedPlot.id);
    setSelectedPlot(null);
  };

  const startDrag = (plot: Plot, mode: DragMode, e: ReactMouseEvent) => {
    if (!editMode || !isAdmin || plot.isLocked) return;

    e.preventDefault();
    e.stopPropagation();

    setEditingPlot(plot);
    setDragMode(mode);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialBounds({ ...plot.bounds });
  };

  const handleMouseMoveGlobal = (e: MouseEvent) => {
    if (!editingPlot || dragMode === 'none' || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

    let newBounds = { ...initialBounds };

    if (dragMode === 'move') {
      newBounds.x = Math.max(0, Math.min(100 - newBounds.width, initialBounds.x + deltaX));
      newBounds.y = Math.max(0, Math.min(100 - newBounds.height, initialBounds.y + deltaY));
    }

    if (dragMode === 'resize') {
      newBounds.width = Math.max(2, Math.min(100 - initialBounds.x, initialBounds.width + deltaX));
      newBounds.height = Math.max(2, Math.min(100 - initialBounds.y, initialBounds.height + deltaY));
    }

    updatePlot(projectId, editingPlot.id, { bounds: newBounds });
  };

  const handleMouseUp = () => {
    setDragMode('none');
    setEditingPlot(null);
  };

  useEffect(() => {
    if (dragMode !== 'none') {
      window.addEventListener('mousemove', handleMouseMoveGlobal);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragMode, editingPlot, dragStart, initialBounds]);

  const toggleLock = (plot: Plot, e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updatePlot(projectId, plot.id, { isLocked: !plot.isLocked });
    toast.success(plot.isLocked ? 'Plot unlocked' : 'Plot locked');
  };

  return (
    <div className="relative w-full h-full">
      {/* MAIN CONTAINER */}
      <div
        ref={containerRef}
        className="relative w-full max-w-full overflow-hidden"
        style={{ aspectRatio: '16 / 9' }}
      >
        {/* IMAGE */}
        <img
          src={layoutImage}
          alt="Layout Plan"
          draggable={false}
          className="w-full h-full block select-none object-contain px-[6px]"
        />

        {/* OVERLAYS */}
        <div className="absolute inset-0">
          {plots.map((plot) => {
            const colors = STATUS_COLORS[plot.status];
            const isHovered = hoveredPlot?.id === plot.id;
            const isEditing = editingPlot?.id === plot.id;
            const canEdit = editMode && isAdmin && !plot.isLocked;

            return (
              <div
                key={plot.id}
                className={`absolute transition-all duration-200 ${
                  canEdit ? 'cursor-move' : 'cursor-pointer'
                } ${isEditing ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                style={{
                  left: `${plot.bounds.x}%`,
                  top: `${plot.bounds.y}%`,
                  width: `${plot.bounds.width}%`,
                  height: `${plot.bounds.height}%`,
                  backgroundColor: colors.bg,
                  border: `2px solid ${colors.border}`,
                  borderRadius: '4px',
                  zIndex: isHovered || isEditing ? 10 : 1,
                }}
                onMouseMove={(e) => !editMode && handleMouseMove(e, plot)}
                onMouseLeave={() => setHoveredPlot(null)}
                onClick={(e) => handlePlotClick(plot, e)}
                onMouseDown={(e) => canEdit && startDrag(plot, 'move', e)}
              >
                <span className="absolute inset-0 flex items-center justify-center text-[3px] sm:text-[10px] font-bold">
                  {plot.plotNumber}
                </span>

                {editMode && isAdmin && (
                  <>
                    <button
                      className="absolute -top-2 -right-2 w-5 h-5 bg-background border rounded-full"
                      onClick={(e) => toggleLock(plot, e)}
                    >
                      {plot.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                    </button>

                    {!plot.isLocked && (
                      <div
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary cursor-se-resize"
                        onMouseDown={(e) => startDrag(plot, 'resize', e)}
                      >
                        <Maximize2 size={10} />
                      </div>
                    )}

                    {!plot.isLocked && (
                      <Move className="absolute top-0.5 left-0.5 w-3 h-3 opacity-50" />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {hoveredPlot && !editMode && (
          <PlotTooltip plot={hoveredPlot} position={tooltipPosition} />
        )}
      </div>

      {selectedPlot && (
        <PlotModal
          plot={selectedPlot}
          project={project}
          isAdmin={isAdmin}
          onClose={() => setSelectedPlot(null)}
          onUpdate={handleUpdatePlot}
          onDelete={handleDeletePlot}
        />
      )}
    </div>
  );
}
