import { useState, useEffect } from 'react'
import { Button, Drawer, Popconfirm, Row, Table, Typography } from 'antd'

import { useAppSelector } from '../../store/hooks'
import { GroupDrawer } from './groupDrawer'
import { IDeleteGroupRequest, IGroup, useDeleteGroupMutation } from '../../services/group'
import { AddContactToGroupDrawer } from './addContactToGroupDrawer'

interface IGroupDrawerParams {
  openGroupDrawerDetails: boolean
  closeGroupDrawerDetails: () => void
  loadGroups: () => void
  loadContacts: () => void
  isGroupsLoading: boolean
}

export const GroupsDrawerDetails: React.FC<IGroupDrawerParams> = ({
  openGroupDrawerDetails,
  closeGroupDrawerDetails,
  loadGroups,
  loadContacts,
  isGroupsLoading
}: IGroupDrawerParams) => {
  const groups = useAppSelector(state => state.listGroupsSlice.groups)
  const [openAddContactToGroupDrawer, setOpenAddContactToGroupDrawer] = useState(false)
  const [openGroupDrawer, setOpenGroupDrawer] = useState(false)
  const [group, setGroup] = useState<IGroup>()
  const [deleteGroup, {
    isLoading: isDeleteGroupLoading,
    isSuccess: isDeleteGroupSuccess,
    reset: resetDeleteGroup
  }] = useDeleteGroupMutation()

  const confirmDelete = async (payload: IDeleteGroupRequest): Promise<void> => {
    await deleteGroup(payload).unwrap()
  }

  const footerComponent: React.ReactNode = <Row style={{ marginBottom: 10 }} justify="end">
    <Button
      style={{ marginRight: 30 }}
    >
      Cancelar
    </Button>
  </Row>

  useEffect(() => {
    if (isDeleteGroupSuccess) {
      loadGroups()
      loadContacts()
      resetDeleteGroup()
    }
  }, [isDeleteGroupSuccess])

  const columns = [
    {
      title: 'Titulo',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: () => <Typography style={{ textAlign: 'center' }}>Ações</Typography>,
      dataIndex: 'idevent',
      render: (_: string, record: IGroup) =>
        groups.length >= 1
          ? (
            <Row justify='end'>
              <Popconfirm
                title={'Deseja excluir este grupo?'}
                cancelText="Cancelar"
                okText="Confirmar"
                okButtonProps={{ loading: isDeleteGroupLoading }}
                onConfirm={async () => await confirmDelete({
                  idgroup: record.idgroup,
                  iduser: record.iduser
                })}
              >
                <Button style={{ marginRight: 20 }} danger>Excluir</Button>
              </Popconfirm>

              <Button
                style={{ marginRight: 20 }}
                onClick={() => {
                  setGroup(record)
                  setOpenGroupDrawer(true)
                }}
                type='primary'
              >
                Editar
              </Button>

              <Button
                onClick={() => {
                  setGroup(record)
                  setOpenAddContactToGroupDrawer(true)
                }}
                type='primary'
              >
                Adicionar contato
              </Button>
            </Row>
            )
          : null
    }
  ]

  return (
    <>
      <Drawer
        destroyOnClose={true}
        title="Meus grupos"
        width={620}
        open={openGroupDrawerDetails}
        onClose={closeGroupDrawerDetails}
        bodyStyle={{ paddingBottom: 80 }}
        footer={footerComponent}
        forceRender
      >
        <Row justify='end'>
          <Button
            onClick={() => setOpenGroupDrawer(true)}
            type="primary"
            style={{ marginBottom: 10 }}
          >
            Criar novo grupo
          </Button>
        </Row>
        <Table
          dataSource={groups}
          columns={columns}
          rowKey="idgroup"
          loading={isGroupsLoading}
        />
      </Drawer>

      <GroupDrawer
        openGroupDrawer={openGroupDrawer}
        closeGroupDrawer={() => {
          setGroup(undefined)
          setOpenGroupDrawer(false)
        }}
        group={group}
        reload={loadGroups}
      />

      <AddContactToGroupDrawer
        openAddContactToGroupDrawer={openAddContactToGroupDrawer}
        closeAddContactToGroupDrawer={() => setOpenAddContactToGroupDrawer(false)}
        reload={loadContacts}
        group={group as IGroup}
      />
    </>
  )
}
