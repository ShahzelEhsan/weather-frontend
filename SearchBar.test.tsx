import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/components/SearchBar';

describe('SearchBar', () => {
  it('calls onSearch with city name when form is submitted', () => {
    const mockSearch = jest.fn();
    render(<SearchBar onSearch={mockSearch} />);

    const input = screen.getByPlaceholderText(/enter city/i);
    fireEvent.change(input, { target: { value: 'New York' } });

    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);

    expect(mockSearch).toHaveBeenCalledWith('New York');
  });
});
