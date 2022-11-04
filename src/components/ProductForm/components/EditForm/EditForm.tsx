// Libs
import { BaseSyntheticEvent, FC, useState } from "react";

const EditForm: FC = ()=>{
  return(
    <div>
      <form>
        <input
          type="text"
          placeholder="Edit name"
        />
        <input
          type="text"
          placeholder="Edit product"
        />
        <button type="button" value="Guardar"/>
      </form>
    </div>
  )
}

export default EditForm;