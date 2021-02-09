import './App.css';
import React from 'react';
import produce from 'immer';

const onDragOver = (event) => {
  event.preventDefault();
}
const onDragEnter = (event) => {
  event.preventDefault();
  event.target.classList.add('placeholder');
}

const onDragLeave = (event) => {
  event.preventDefault();
  event.target.classList.remove('placeholder');
}

const onDragStart = (event) => {
  event.target.classList.add('dragging');
  event.dataTransfer.setData('text/plain', event.target.getAttribute('data-index'));
}

const onDragEnd = (event) => {
  event.target.classList.remove('dragging');
}

function DraggableRow(props) {
  
  const onDrop = (event) => {
    event.target.classList.remove('placeholder');
    const source = parseInt(event.dataTransfer.getData('text/plain'));
    props.reorderRows(source, props.index);
  };

  return (
    <div
      draggable 
      className="row"
      data-index={props.index}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragStart={onDragStart}
    >
        {props.data}
    </div>
  );
}

function Table(props) {
  const [data, setData] = React.useState(props.data);

  const reorderRows = (source, target) => {
      const newData = produce(data, (draft) => {
          [draft[source], draft[target]] = [data[target], data[source]];
      });

      setData(newData);
  }

  return (
    <div role="table" className="table">
        {
          data.map((datum, index) => <DraggableRow index={index} data={datum} reorderRows={reorderRows} />)
        }
    </div>
  );
}

const data = [
    'Row 1',
    'Row 2',
    'Row 3',
    'Row 4',
    'Row 5',
    'Row 6',
    'Row 7',
    'Row 8',
    'Row 9',
];

function App() {
  const blob = new Blob([data], { type: 'application/json' });
  const link = URL.createObjectURL(blob);

  return (
    <React.Fragment>
      <Table data={data} />
      <a href={link} download="preferences.json">Import</a>
    </React.Fragment>
  );
}

export default App;
