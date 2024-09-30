import { Select } from "antd";

// export const renderDropdown = (options: any[]) => (
//     <Select>
//       {options.map(option => (
//         <Select.Option key={option.id} value={option.name}>
//           {option.name}
//         </Select.Option>
//       ))}
//     </Select>
// );
// Define the types for the props
interface MySelectComponentProps {
    options: { id: number; name: string }[];
    handleChange?: (value: number) => void; // handleChange function takes a string (value of selected option)
  }
const MySelectComponent: React.FC<MySelectComponentProps>  = ({ options, handleChange }) => {
    return (
      <Select onChange={handleChange}>
        {options.map(option => (
          <Select.Option key={option.id} value={option.id}>
            {option.name}
          </Select.Option>
        ))}
      </Select>
    );
  };
  
  export default MySelectComponent;