import React, {useCallback, useEffect, useMemo, useState} from "react";
import {createEditor, Transforms, Editor, Text} from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import Image from "react-bootstrap/Image";
import {Button} from "react-bootstrap";
import './SlateInput.css';

const CustomEditor = {
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.bold === true,
      universal: true,
    })

    return !!match
  },

  isItalicMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.italic === true,
      universal: true,
    })

    return !!match
  },

  isListBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'list',
    })

    return !!match
  },

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor)
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    )
  },

  toggleItalicMark(editor) {
    const isActive = CustomEditor.isItalicMarkActive(editor)
    Transforms.setNodes(
      editor,
      { italic: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    )
  },

  toggleListBlock(editor) {
    const isActive = CustomEditor.isListBlockActive(editor)
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'list' },
      { match: n => Editor.isBlock(editor, n) }
    )
  },
}

const SlateInput = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem('comment')) || [
      {
        type: 'paragraph',
        children: [{ text: 'Décrivez ici votre avis.' }],
      },
    ]
  )

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
      onChange={newValue => {
        setValue(newValue);
        const content = JSON.stringify(newValue);
        localStorage.setItem('comment', content);
      }}
    >
      <div>
        <Button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleBoldMark(editor)
          }}
          variant="outline-dark"
        >
          <strong>B</strong>
        </Button>
        <Button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleItalicMark(editor)
          }}
          variant="outline-dark"
        >
          <em>i</em>
        </Button>
        <Button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleListBlock(editor)
          }}
          variant="outline-dark"
        >
          <Image src={process.env.PUBLIC_URL + '/slateList.png'} fluid />
        </Button>
      </div>
      <Editable
        style={editableStyle}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={event => {
          if (!event.ctrlKey) {
            return
          }

          switch (event.key) {
            case 'l': {
              event.preventDefault()
              CustomEditor.toggleListBlock(editor)
              break
            }

            case 'b': {
              event.preventDefault()
              CustomEditor.toggleBoldMark(editor)
              break
            }

            case 'i': {
              event.preventDefault()
              CustomEditor.toggleItalicMark(editor)
              break
            }
          }
        }}
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

export default SlateInput;

const imgStyle = {
  width: '40px',
};

const editableStyle = {
  border: '1px grey solid',
  borderRadius: '5px',
};


