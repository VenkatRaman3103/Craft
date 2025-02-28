import { field } from "@/Types/fields";
import { FieldsList } from "./FieldsList";

export const Fields = ({ fields }: { fields: field[] }) => {
    return (
        <div>
            {fields?.map((item: field, index: number) => {
                const Field = FieldsList[item.type];
                return <Field key={index} data={item} />;
            })}
        </div>
    );
};
