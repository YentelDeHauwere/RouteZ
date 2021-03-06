import React, { useCallback, useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

// Layouts
import { UsualLayout } from '../layouts';

// Services
import { useApi, useAuth } from '../services';

// Components
import { UsualButton, DeleteButton } from '../components';

// Routes
import * as Routes from '../routes';

// Images
import Eye from '../assets/icons/view.png';

const Signposts = () => {
  // Routing
  const history = useHistory();

  // Services
  const { getSignPosts, deleteSignpost, publishSignpost } = useApi();
  const { currentUser } = useAuth();

  // States
  const [ signposts, setSignposts ] = useState();

  // Fetch
  const getData = useCallback(async () => {
    try {
      const data = await getSignPosts(currentUser.token);
      setSignposts(data);
    } catch (e) {
      console.log(e);
    };
  }, [getSignPosts, currentUser]);

  useEffect(() => {
    getData();
  }, [getData]);

  // Delete
  const deleteItem = async (id) => {
    await deleteSignpost(currentUser.token, id);
    window.location.reload();
  };

  const publishItem = async (bool, id) => {
    await publishSignpost(currentUser.token, bool, id);
    window.location.reload();
  };

  return (
    <UsualLayout>
      <Row>
        <Col xs={12} className="d-flex align-items-center justify-content-between">
          <h1 className="overview__title">
            Alle wegwijzers
          </h1>
          <UsualButton text="Wegwijzer maken" action={() => history.push(Routes.CREATE_SIGNPOST)} />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className="overview__items">
            {
              signposts && signposts.map((signpost, index) => {
                return (
                  <div className="overview__items--item d-flex justify-content-between align-items-center" key={index}>
                    <div className="overview__items--item--text">
                      <h5 onClick={() => history.push(Routes.SIGNPOST.replace(':id', signpost._id))}>{signpost.title}</h5>
                      <h6>Bevat {signpost.modules.length} modules</h6>
                    </div>
                    <div className="overview__items--item--buttons d-flex align-items-center">
                      <img src={Eye} alt="publish" className={`publish-button ${signpost.published ? '' : 'not-published'}`} onClick={() => publishItem(!signpost.published, signpost._id)}/>
                      <UsualButton text="Bewerk" action={() => history.push(Routes.EDIT_SIGNPOST.replace(':id', signpost._id))} />
                      <DeleteButton text="Verwijder" action={() => deleteItem(signpost._id)} />
                    </div>
                  </div>
                )
              })
            }
          </div>
        </Col>
      </Row>
    </UsualLayout>
  );
};

export default Signposts;
