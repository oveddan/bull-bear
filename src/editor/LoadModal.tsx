import { GraphJSON } from '@oveddan-behave-graph/core';
import {
  FC,
  useState,
  useEffect,
  useCallback,
  useMemo,
  CSSProperties
} from 'react';
import { useReactFlow } from 'reactflow';
import { Modal } from './Modal';

export type LoadModalProps = {
  open?: boolean;
  onClose: () => void;
  setBehaviorGraph: (value: GraphJSON) => void;
};

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

const useDropZoneStyle = ({
  isFocused,
  isDragAccept,
  isDragReject
}: {
  isFocused: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
}) => {
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isFocused, isDragAccept, isDragReject]
  ) as CSSProperties;

  return style;
};

const emptyGraphJson = (): GraphJSON => ({});

export const LoadModal: FC<LoadModalProps> = ({
  open = false,
  onClose,
  setBehaviorGraph
}) => {
  const [behaviorGraphString, setBehaviorGraphString] = useState<string>();

  const [uploadedModelFile, setUploadedModelFile] = useState<File>();

  const instance = useReactFlow();

  useEffect(() => {
    // if reopening - clear the state
    if (open) {
      setUploadedModelFile(undefined);
      setBehaviorGraphString(undefined);
    }
  }, [open]);

  const handleLoad = useCallback(() => {
    const graph = behaviorGraphString
      ? (JSON.parse(behaviorGraphString) as GraphJSON)
      : emptyGraphJson();

    setBehaviorGraph(graph);

    // TODO better way to call fit vew after edges render
    setTimeout(() => {
      instance.fitView();
    }, 100);

    handleClose();
  }, [setBehaviorGraph, behaviorGraphString, uploadedModelFile, instance]);

  const handleClose = useCallback(() => {
    setBehaviorGraphString(undefined);
    onClose();
  }, []);

  return (
    <Modal
      title="Load Behave Graph"
      actions={[
        { label: 'Cancel', onClick: handleClose },
        {
          label: 'Load',
          onClick: handleLoad,
          disabled: !uploadedModelFile && !behaviorGraphString
        }
      ]}
      open={open}
      onClose={onClose}
    >
      <div className="grid w-full gap-2">
        <div>
          <label
            htmlFor="behavee-graph"
            className="block text-sm font-medium text-gray-700"
          >
            behave graph json
          </label>
          <div className="mt-1">
            <textarea
              id="behave-graph"
              name="behave-graph"
              rows={5}
              className="block w-full border-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={behaviorGraphString}
              onChange={(e) => setBehaviorGraphString(e.currentTarget.value)}
            />
          </div>
          {/* <p className="mt-2 text-sm text-gray-500">Write a few sentences about yourself.</p> */}
        </div>
      </div>
    </Modal>
  );
};
