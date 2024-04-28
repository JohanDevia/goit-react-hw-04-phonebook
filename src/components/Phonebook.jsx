import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import {
  Container,
  FormPhonebook,
  ContactsList,
  FinderContacts,
} from './Phonebook.styled';

const Phonebook = () => {
  const [contacts, setContacts] = useState(
    JSON.parse(localStorage.getItem('contacts')) || []
  );
  const [filter, setFilter] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  useEffect(() => {
    const storedContacts = JSON.parse(localStorage.getItem('contacts'));
    if (storedContacts) {
      setContacts(storedContacts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'number') setNumber(value);
  };

  const handleFilterChange = e => {
    setFilter(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const isNameExists = contacts.some(
      contact => contact.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (isNameExists) {
      alert(`The contact ${name.trim()} is already in the agenda.`);
      return;
    }

    if (name.trim() && number.trim()) {
      const newContact = {
        id: nanoid(),
        name: name.trim(),
        number: number.trim(),
      };
      setContacts(prevContacts => [...prevContacts, newContact]);
      setName('');
      setNumber('');
    }
  };

  const handleContactDelete = id => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== id)
    );
  };

  const renderContacts = () => {
    const filteredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
    return (
      <ul>
        {filteredContacts.map(contact => (
          <ContactsList key={contact.id}>
            »{contact.name}: {contact.number} {}
            <button
              onClick={() => handleContactDelete(contact.id)}
              style={{ marginLeft: '10px' }}
            >
              Delete
            </button>
          </ContactsList>
        ))}
      </ul>
    );
  };

  return (
    <Container className="App">
      <h1>PHONEBOOK</h1>
      <FormPhonebook onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter contact name"
          required
          value={name}
          onChange={handleInputChange}
        />
        <label htmlFor="number">Number</label>
        <input
          type="tel"
          name="number"
          placeholder="Enter contact number"
          pattern="\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}"
          title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
          required
          value={number}
          onChange={handleInputChange}
        />
        <button type="submit">Add Contact</button>
      </FormPhonebook>

      <FinderContacts>
        <p>Contacts</p>
        <label htmlFor="filter">Search: </label>
        <input
          type="text"
          id="filter"
          name="filter"
          placeholder="Search contact"
          value={filter}
          onChange={handleFilterChange}
        />
      </FinderContacts>

      {renderContacts()}
    </Container>
  );
};

export default Phonebook;
