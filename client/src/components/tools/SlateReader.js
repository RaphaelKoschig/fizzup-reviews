import React, {useCallback, useMemo, useState} from "react";
import {createEditor} from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

const SlateReader = ({ itemValue }) => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState(JSON.parse(itemValue));

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'list':
        return <ListElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])

  return (
    <Slate
      editor={editor}
      value={value}
     onChange={newValue => setValue(newValue)}>
      <Editable
        readOnly={true}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
      />
    </Slate>
  )
}

// Define a React component to render leaves with bold text.
const Leaf = props => {
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? 'bold' : 'normal',
        fontStyle: props.leaf.italic ? 'italic' : 'normal',
      }}
    >
      {props.children}
    </span>
  )
}

const ListElement = props => {
  return (
    <pre {...props.attributes}>
      <ul><li>{props.children}</li></ul>
    </pre>
  )
}

const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>
}

export default SlateReader;
