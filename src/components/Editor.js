import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/3024-day.css';
import 'codemirror/theme/3024-night.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/rubyblue.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/css/css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import './css/Editor.css'

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const modeOptions = {
    javascript: { name: 'javascript', json: true },
    python: { name: 'python' },
    cplusplus: { name: 'text/x-c++src' },
    java: { name: 'text/x-java' },
    xml: { name: 'xml' },
  };
  const themeOptions = [
    'dracula',
    '3024-day',
    '3024-night',
    'eclipse',
    'material',
    'rubyblue',
  ];

  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById('realtimeEditor'),
        {
          mode: modeOptions.javascript,
          theme: 'dracula',
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editorRef.current.on('change', (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== 'setValue') {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  const handleModeChange = (e) => {
    const mode = e.target.value;
    editorRef.current.setOption('mode', modeOptions[mode]);
  };

  const handleThemeChange = (e) => {
    const theme = e.target.value;
    editorRef.current.setOption('theme', theme);
  };

  const handleRunCode = () => {
    const code = editorRef.current.getValue();
    switch (editorRef.current.getOption("mode").name) {
      case "javascript":
        try {
          eval(code);
        } catch (e) {
          console.error(e);
        }
        break;
      case "python":
        // Execute the Python code using a runtime environment

        break;
      case "text/x-c++src":
        // Execute the C++ code using a runtime environment

        break;
      case "text/x-java":
        // Execute the Java code using a runtime environment

        break;
      case "xml":
        // Execute the XML code using a runtime environment

        break;
      default:
        break;
    }
  };
  return (
    <div className='bg-blue-300 h-max w-max' >
      <div className='flex lg:flex-row md:flex-row flex-col gap-4 justify-evenly '>
        <div className='flex flex-row mt-3'>
          <label htmlFor="mode-select" className="lg:text-xl text-md font-bold mr-2">Language:</label>

          <Select
            id='mode-select'
            onChange={handleModeChange}
            displayEmpty
            className='w-32 h-10'
            inputProps={{ 'aria-label': 'Without label' }}
            defaultValue="none"

          >
            <MenuItem value={"javascript"}>javascript</MenuItem>
            <MenuItem value={"python"}>python</MenuItem>
            <MenuItem value={"cplusplus"}>C++</MenuItem>
            <MenuItem value={"java"}>java</MenuItem>
            <MenuItem value={"xml"}>xml</MenuItem>
          </Select>
        </div>
        <div className='flex lg:flex-row  mt-3'>
          <label htmlFor="theme-select" className="lg:text-xl text-md font-bold mr-2">Theme:</label>
          
          <Select
            id='theme-select'
            onChange={handleThemeChange}
            displayEmpty
            className='w-32 h-10'
            inputProps={{ 'aria-label': 'Without label' }}

          >
            {themeOptions.map((theme) => (
              <MenuItem key={theme} value={theme}>{theme}</MenuItem>
              
            ))}
       
          </Select>
        </div>
      </div>
      <textarea id="realtimeEditor" className='h-screen'></textarea>
      {/* <button onClick={handleRunCode}>Run</button> */}
    </div>
  );
};

export default Editor;
