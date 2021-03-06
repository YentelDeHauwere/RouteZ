import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// Routes
import * as Routes from '../routes';

// Services
import { useApi, useAuth } from '../services';

// Formatting date
import { default as moment } from 'moment';
import 'moment/locale/nl-be';

// Components
import { Tags, RadioSelect, ButtonSmall } from '../components';

// Small function to force a re-render
const useForceUpdate = () => {
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
};

const EditMaterial = () => {
  const forceUpdate = useForceUpdate();

  // Get material id
  const { state } = useLocation();
  const materialId = state.id;

  // Routing
  const history = useHistory();

  // Services
  const { getMaterial, editMaterial, getSignPosts, uploadDoc } = useApi();
  const { currentUser } = useAuth();

  // States 
  const [ material, setMaterial ] = useState();
  const [ signposts, setSignposts ] = useState();
  const [ newFile, setNewFile ] = useState();

  const [ selectedTags, setSelectedTags ] = useState();
  const [ selectedModule, setSelectedModule ] = useState();
  const [ selectedType, setSelectedType ] = useState();
  const [ selectedTarget, setSelectedTarget ] = useState();

  const [ form, setForm ] = useState({
    title: '',
    description: '',
    _moduleId: '',
    type: '',
    filename: '',
    file: '',
    size: '',
    videoUrl: '',
    target: '',
    _tagIds: [],
  });

  // Init date
  let created = moment(material && material._createdAt);
  let newCreated = moment(Date.now());
  moment.locale('nl-be');

  const fetchMaterial = useCallback(async () => {
    try {
      if (!materialId) {
        history.push(Routes.NOT_FOUND);
        return;
      };

      const data = await getMaterial(materialId);
      const signpostsData = await getSignPosts(currentUser.token);

      setMaterial(data);
      setForm({
        title: data.title,
        description: data.description,
        _moduleId: data._moduleId,
        type: data.type,
        filename: data.filename,
        file: data.file,
        size: data.size,
        videoUrl: data.videoUrl,
        target: data.target,
        _tagIds: data._tagIds,
      });
      setSelectedTags(data.tags ? data.tags : '');
      setSelectedTarget(data.target);
      setSignposts(signpostsData);
    } catch (e) {
      history.push(Routes.NOT_FOUND);
    };
  }, [materialId, history, getMaterial, getSignPosts, currentUser]);

  useEffect(() => {
    fetchMaterial();
  }, [fetchMaterial]);

  const uploadNewDocument = async (e) => {
    e.preventDefault();
    const upload = e.target.files[0];
    setForm({
      ...form,
      filename: upload.name,
      size: `${(upload.size / (1024*1024)).toFixed(2)}MB`,
      file: null,
    });
    setNewFile(e.target.files[0]);
  };

  const updateTags = (array) => {
    setSelectedTags(array);
    forceUpdate();
  };

  const updateType = (type) => {
    setSelectedType(type);
    setForm({
      ...form,
      type: type,
    })
    forceUpdate();
  };

  const updateModule = (module) => {
    setSelectedModule(module);
    forceUpdate();
  };

  const updateTarget = (target) => {
    setSelectedTarget(target);
    forceUpdate();
  };

  const updateMaterial = async (e) => {
    // e.preventDefault();

    let result;
    let tags;

    if (selectedTags) {
      let array = [];

      for (let i = 0; i < selectedTags.length; i++) {
        array.push(selectedTags._id);
      };

      tags = array;
    } else {
      tags = form._tagIds;
    };

    if (selectedType === 'Video') {
      result = await editMaterial(material._id, {
        title: form.title,
        description: form.description,
        _moduleId: selectedModule ? selectedModule : form._moduleId,
        type: selectedType ? selectedType : form.type,
        videoUrl: form.videoUrl,
        target: selectedTarget,
        _tagIds: tags,
      });
    } else {
      if (form.file === null) {
        const uploaded = await uploadDoc(newFile);
        result = await editMaterial(material._id, {
          title: form.title,
          description: form.description,
          _moduleId: selectedModule ? selectedModule : form._moduleId,
          type: selectedType ? selectedType : form.type,
          filename: uploaded.filename,
          file: form.file,
          size: form.size,
          target: selectedTarget,
          _tagIds: tags,
        });
      } else {
        result = await editMaterial(material._id, {
          title: form.title,
          description: form.description,
          _moduleId: selectedModule ? selectedModule : form._moduleId,
          type: selectedType ? selectedType : form.type,
          filename: form.file,
          file: form.file,
          size: form.size,
          target: selectedTarget,
          _tagIds: tags,
        });
      };
    };

    if (result) history.push(Routes.MATERIAL.replace(':name', material._id));
  };

  const changeInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="edit-material">
    {
      material && signposts && (
        <>
          <h1 className="edit-material__title">Bestand bewerken</h1>
          <form className="edit-material-form">
		  	<label className="edit-material-form__label">Titel</label>
            <input className="edit-material-form__input" onChange={(e) => changeInput(e)} type="text" defaultValue={form.title} name="title" id="title" />

			<label className="edit-material-form__label">Beschrijving</label>
            <textarea className="edit-material-form__input" onChange={(e) => changeInput(e)} defaultValue={form.description} name="description" id="description" />
          </form>

          <Tags 
            defaultTags={material.tags} 
            setForm={updateTags}
          />

		  <label className="edit-material-form__label">Bestand</label>
          <RadioSelect 
            text="Welk soort bestand wil je uploaden?"
            grouped={false}
            data={[
              {_id: "Document", title: "Document"},
              {_id: "Presentatie", title: "Presentatie"},
              {_id: "Video", title: "Video"},
            ]}
            name="type"
            defaultSelected={material.type}
            setSelected={updateType}
          />

		  <label className="edit-material-form__label">Doelgroep</label>
          <RadioSelect 
            text="Wat is jouw doelgroep?"
            grouped={false}
            data={[
              {_id: "De kiendjes", title: "De kiendjes"},
              {_id: "De vintjes", title: "De vintjes"},
              {_id: "De vrouwtjes", title: "De vrouwtjes"},
            ]}
            name="target"
            defaultSelected={material.target}
            setSelected={updateTarget}
          />

		<label className="edit-material-form__label">Toewijzing module</label>
          <RadioSelect 
            text="Aan welke module wil je deze toewijzen?"
            grouped={true}
            data={signposts}
            defaultSelected={material._moduleId}
            name="module"
            setSelected={updateModule}
          />
          {
              form && form.type === 'Video' ? (
                <>
                <label className="create-material__label d-block">Link naar video</label>
                <input className="create-material-form__input w-100" defaultValue={form.videoUrl} onChange={(e) => changeInput(e)} type="text" placeholder="video-url" name="videoUrl" id="videoUrl" />
                </>
              ) : (
                <>
                <div>
                  <div className="create-material__upload-button">
                    <span>Bestand wijzigen</span>
                    <input type="file" accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf, image/*" onChange={(e) => uploadNewDocument(e)} name="file" id="file"/>
                  </div>
                </div>
                {
                  form.file && (
                    <div className="create-material__upload-text">
                      <strong>{form.filename}</strong><br/>
                      <span>{form.file ? created.format('L') : newCreated.format('L')} | {form.size}</span>
                    </div>
                  )
                }

                </>
            )
          }
	

		  <div className="create-material-buttons">
			<ButtonSmall content="Annuleren" color="secondary" onClick={() => history.push(Routes.MY_MATERIALS)}/>
			<ButtonSmall content="Opslaan" color="primary" onClick={(e) => updateMaterial(e)} type="submit"/>
		  </div>
        </>
      )
    }
    </div>
  );
};

export default EditMaterial;
