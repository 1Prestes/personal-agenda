import React, { useState, useEffect } from 'react'
import { Button, Popconfirm, Row, Select, Table, Typography } from 'antd'
import dayjs from 'dayjs'

import { ContactDrawer } from './contactDrawer'
import { useAppSelector } from '../../store/hooks'
import { IContact, useDeleteContactMutation, useListContactsMutation } from '../../services/contact'
import { getUserIdByToken } from '../../helpers/jwt'
import { GroupsDrawerDetails } from './groupsDrawerDetails'
import { IGroup, useListGroupsMutation } from '../../services/group'
import { useListContactsFromGroupMutation } from '../../services/groupsRelationship'

interface IDeleteContact {
  idcontact: string
  iduser: string
}

interface IFilteredGroups {
  label: string
  value: string
}

interface IError {
  code: string
  message: string
  shortMessage: string
}

interface IErrorResponse {
  data: IError
}

export const Contacts: React.FC = () => {
  const contacts = useAppSelector(state => state.listContactsSlice.contacts)
  const contactsFromGroups = useAppSelector(state => state.listContactsFromGroupSlice.group)
  const groups: IGroup[] = useAppSelector(state => state.listGroupsSlice.groups)
  const [listContacts, { isLoading: isListContactsLoading }] = useListContactsMutation()
  const [listContactsFromGroup, {
    isLoading: isContactsFromGroupLoading,
    isError: isListContactsFromGroupError,
    error: listContactsFromGroupError
  }] = useListContactsFromGroupMutation()
  const [deleteContact, { isLoading: isDeleteContactLoading, isSuccess: isDeleteContactSuccess }] = useDeleteContactMutation()
  const [listGroups, { isLoading: isGroupsLoading }] = useListGroupsMutation()
  const [openContactDrawer, setOpenContactDrawer] = useState(false)
  const [openGroupDrawerDetails, setOpenGroupDrawerDetails] = useState(false)
  const [groupOptions, setGroupOptions] = useState<IFilteredGroups[]>([])
  const [selected, setSelected] = useState('')
  const [selectedContact, setSelectedContact] = useState<IContact>()
  const [reload, setReload] = useState(false)
  const { Title } = Typography

  const loadContacts = async (): Promise<void> => {
    const iduser = getUserIdByToken()

    selected
      ? await listContactsFromGroup({ iduser: iduser as string, idgroup: selected }).unwrap()
      : await listContacts(iduser as string).unwrap()
  }

  const loadGroups = async (): Promise<void> => {
    const iduser = getUserIdByToken()

    await listGroups(iduser as string).unwrap()
  }

  const confirmDelete = async (payload: IDeleteContact): Promise<void> => {
    await deleteContact(payload).unwrap()
  }

  const filterGroups = (): void => {
    const options = groups.map(group => ({ label: group.title, value: group.idgroup }))
    setGroupOptions([{ label: 'Todos', value: '' }, ...options])
  }

  useEffect(() => {
    void loadContacts()
    void loadGroups()
  }, [])

  useEffect(() => {
    if (groups.length) {
      filterGroups()
    }
  }, [groups])

  useEffect(() => {
    if (isDeleteContactSuccess || reload) {
      void loadContacts()
    }
  }, [isDeleteContactSuccess, reload])

  useEffect(() => {
    if (selected) {
      void loadContacts()
    }
  }, [selected])

  useEffect(() => {
    const error = listContactsFromGroupError as IErrorResponse

    if (error && error?.data?.code === 'HGE-004') {
      setSelected('')
      void loadGroups()
    }
  }, [isListContactsFromGroupError])

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Data de nascimento',
      dataIndex: 'birth_date',
      key: 'birth_date',
      render: (value: Date) => dayjs(value).add(3, 'hours').format('DD/MM/YYYY')
    },
    {
      title: 'Endereço',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: () => <Typography style={{ textAlign: 'center' }}>Ações</Typography>,
      dataIndex: 'idevent',
      render: (_: string, record: IContact) =>
        contacts.length >= 1
          ? (
            <Row justify='center'>
              <Popconfirm
                title={'Deseja excluir este contato?'}
                okButtonProps={{ loading: isDeleteContactLoading }}
                onConfirm={async () => await confirmDelete({ idcontact: record?.idcontact, iduser: record?.iduser })}
                cancelText="Cancelar"
                okText="Confirmar"
              >
                <Button danger style={{ marginRight: 20 }}>Excluir</Button>
              </Popconfirm>
              <Button
                type='primary'
                onClick={() => {
                  setSelectedContact(record)
                  setOpenContactDrawer(true)
                }}
              >
                Editar
              </Button>
            </Row>
            )
          : null
    }
  ]

  return <>
    <div style={{ padding: 10 }}>
      <Row justify="space-between">
        <Row>
          <Title style={{ marginRight: 20 }} level={4}>Meus Contatos</Title>

          <Select
            loading={isGroupsLoading}
            style={{ width: 200 }}
            placeholder="Meus grupos"
            onSelect={(selected) => setSelected(selected)}
            key="idgroup"
            filterSort={(optionA, optionB) => {
              if (optionB.label === 'Todos') return 1
              return (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }}
            options={groupOptions}
          />
        </Row>

        <Row>
          <Row>
            <Button
              style={{ marginRight: 50 }}
              onClick={() => setOpenGroupDrawerDetails(true)}
              disabled={isListContactsLoading}
              type='primary'
            >
              Grupos
            </Button>
          </Row>
          <Button
            type='primary'
            onClick={() => setOpenContactDrawer(true)}
            disabled={isListContactsLoading}
          >
            Novo
          </Button>
        </Row>
      </Row>

      <Table
        dataSource={selected ? contactsFromGroups?.contacts : contacts}
        columns={columns}
        loading={isListContactsLoading || isContactsFromGroupLoading}
        rowKey="idcontact"
      />
    </div>

    <ContactDrawer
      openContactDrawer={openContactDrawer}
      closeContactDrawer={() => {
        setSelectedContact(undefined)
        setOpenContactDrawer(false)
      }}
      contact={selectedContact}
      reload={() => {
        setReload(true)
        setTimeout(() => {
          setReload(false)
        }, 300)
      }}
    />

    <GroupsDrawerDetails
      openGroupDrawerDetails={openGroupDrawerDetails}
      closeGroupDrawerDetails={() => {
        setOpenGroupDrawerDetails(false)
      }}
      loadGroups={loadGroups}
      loadContacts={loadContacts}
      isGroupsLoading={isGroupsLoading}
    />
  </>
}
